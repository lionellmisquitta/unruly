// Quarantined P0a-WIN-D1 feasibility; not the UNRULY product renderer.
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0A00
#endif
#define WIN32_LEAN_AND_MEAN
#define NOMINMAX
#include <windows.h>
#include <windowsx.h>
#include <algorithm>
#include <string>
#include "capture_model.hpp"

namespace {
constexpr int headerHeight=78;
constexpr int footerHeight=50;
constexpr int clearId=101;
Capture capture;
std::uint64_t penEvents=0,mouseEvents=0,touchEvents=0;
bool pressureKnown=false;
double lastPressure=0;
std::wstring message=L"Ready: draw with your pen. Mouse/touch do not ink.";
HWND clearButton=nullptr;

void errorBox(const wchar_t* action) {
    const auto error=GetLastError();
    const std::wstring detail=std::wstring(action)+L" failed. Windows error "+std::to_wstring(error);
    MessageBoxW(nullptr,detail.c_str(),L"UNRULY diagnostic error",MB_OK|MB_ICONERROR);
}
void refresh(HWND window) { InvalidateRect(window,nullptr,FALSE); }
void cancel(HWND window,const wchar_t* reason) { capture.cancel(); message=reason; refresh(window); }
bool insideCanvas(HWND window,POINT point) {
    RECT rect{};GetClientRect(window,&rect);
    return point.x>=0 && point.x<rect.right && point.y>=headerHeight && point.y<rect.bottom-footerHeight;
}
void paint(HWND window) {
    PAINTSTRUCT ps{};HDC dc=BeginPaint(window,&ps);
    RECT rect{};GetClientRect(window,&rect);
    FillRect(dc,&rect,reinterpret_cast<HBRUSH>(GetStockObject(WHITE_BRUSH)));
    RECT header{0,0,rect.right,headerHeight};
    FillRect(dc,&header,reinterpret_cast<HBRUSH>(GetStockObject(LTGRAY_BRUSH)));
    SetBkMode(dc,TRANSPARENT);
    const std::wstring pressure=pressureKnown?std::to_wstring(lastPressure):L"unavailable";
    const std::wstring status=L"Pen events: "+std::to_wstring(penEvents)+L" | Mouse: "+std::to_wstring(mouseEvents)
        +L" | Touch: "+std::to_wstring(touchEvents)+L" | Samples: "+std::to_wstring(capture.samples.size())
        +L" / 8000\nPressure: "+pressure+L" | "+message;
    RECT text{12,8,rect.right-12,headerHeight-5};
    DrawTextW(dc,status.c_str(),-1,&text,DT_LEFT|DT_WORDBREAK|DT_NOPREFIX);
    const int saved=SaveDC(dc);
    IntersectClipRect(dc,0,headerHeight,rect.right,rect.bottom-footerHeight);
    for (std::size_t i=0;i<capture.samples.size();++i) {
        const auto& point=capture.samples[i];
        const int width=point.pressureKnown?static_cast<int>(1.0+11.0*point.pressure):4;
        HPEN pen=CreatePen(PS_SOLID,width,RGB(23,34,59));
        if (!pen) continue;
        HGDIOBJ oldPen=SelectObject(dc,pen);
        const int x=static_cast<int>(point.x),y=static_cast<int>(point.y);
        if (i>0 && capture.samples[i-1].stroke==point.stroke) {
            const auto& previous=capture.samples[i-1];
            MoveToEx(dc,static_cast<int>(previous.x),static_cast<int>(previous.y),nullptr);
            LineTo(dc,x,y);
        } else {
            HBRUSH brush=CreateSolidBrush(RGB(23,34,59));
            if (brush) {
                HGDIOBJ oldBrush=SelectObject(dc,brush);
                const int radius=std::max(1,width/2);
                Ellipse(dc,x-radius,y-radius,x+radius+1,y+radius+1);
                SelectObject(dc,oldBrush);DeleteObject(brush);
            }
        }
        SelectObject(dc,oldPen);DeleteObject(pen);
    }
    if(saved)RestoreDC(dc,saved);
    EndPaint(window,&ps);
}
void pointer(HWND window,UINT type,WPARAM wParam) {
    const UINT32 id=GET_POINTERID_WPARAM(wParam);
    POINTER_INPUT_TYPE kind=PT_POINTER;
    if(!GetPointerType(id,&kind)) {
        message=L"GetPointerType failed: "+std::to_wstring(GetLastError());
        capture.cancel();refresh(window);return;
    }
    if(kind!=PT_PEN) {
        if(kind==PT_TOUCH)++touchEvents;
        message=kind==PT_TOUCH?L"Touch detected: diagnostic only, no ink.":L"Non-pen pointer: no ink.";
        refresh(window);return;
    }
    ++penEvents;
    POINTER_PEN_INFO info{};
    if(!GetPointerPenInfo(id,&info)) {
        message=L"GetPointerPenInfo failed: "+std::to_wstring(GetLastError());
        capture.cancel();pressureKnown=false;refresh(window);return;
    }
    pressureKnown=(info.penMask&PEN_MASK_PRESSURE)!=0;
    lastPressure=pressureKnown?static_cast<double>(info.pressure)/1024.0:0.0;
    POINT point=info.pointerInfo.ptPixelLocation;
    if(!ScreenToClient(window,&point)) {
        message=L"ScreenToClient failed: "+std::to_wstring(GetLastError());
        capture.cancel();refresh(window);return;
    }
    const bool contact=(info.pointerInfo.pointerFlags&POINTER_FLAG_INCONTACT)!=0;
    if(type==WM_POINTERUP || !contact || (info.pointerInfo.pointerFlags&POINTER_FLAG_CANCELED)!=0) {
        capture.end(id);message=L"Pen ended/hover: no ink.";
    } else if(!insideCanvas(window,point)) {
        capture.end(id);message=L"Pen outside canvas: stroke ended.";
    } else {
        const bool added=type==WM_POINTERDOWN
            ?capture.begin(id,point.x,point.y,pressureKnown,lastPressure)
            :capture.append(id,point.x,point.y,pressureKnown,lastPressure);
        message=capture.full?L"LIMIT reached: use Clear."
            :added?(pressureKnown?L"Pen ink; genuine reported pressure.":L"Pen ink; pressure unavailable, fixed diagnostic width.")
            :L"Sample rejected or no active matching contact.";
    }
    refresh(window);
}
LRESULT CALLBACK windowProc(HWND window,UINT type,WPARAM wParam,LPARAM lParam) {
    switch(type) {
    case WM_CREATE:
        clearButton=CreateWindowW(L"BUTTON",L"Clear diagnostic",WS_CHILD|WS_VISIBLE|BS_PUSHBUTTON,
            12,12,160,34,window,reinterpret_cast<HMENU>(static_cast<INT_PTR>(clearId)),GetModuleHandleW(nullptr),nullptr);
        if(!clearButton){errorBox(L"Create Clear button");return -1;}
        return 0;
    case WM_SIZE: {
        RECT rect{};GetClientRect(window,&rect);
        if(clearButton)MoveWindow(clearButton,12,std::max(headerHeight,static_cast<int>(rect.bottom)-footerHeight+8),180,34,TRUE);
        capture.cancel();refresh(window);return 0;
    }
    case WM_GETMINMAXINFO: {
        auto* limits=reinterpret_cast<MINMAXINFO*>(lParam);
        limits->ptMinTrackSize={640,360};return 0;
    }
    case WM_COMMAND:
        if(LOWORD(wParam)==clearId && HIWORD(wParam)==BN_CLICKED) {
            capture.clear();penEvents=0;mouseEvents=0;touchEvents=0;pressureKnown=false;
            message=L"Cleared: draw with pen. Counters visible from launch.";refresh(window);
        }
        return 0;
    case WM_POINTERDOWN:case WM_POINTERUPDATE:case WM_POINTERUP:
        pointer(window,type,wParam);return 0;
    case WM_POINTERCAPTURECHANGED:
        capture.end(GET_POINTERID_WPARAM(wParam));message=L"Pointer capture ended.";refresh(window);return 0;
    case WM_MOUSEMOVE:case WM_LBUTTONDOWN:case WM_LBUTTONUP:
        ++mouseEvents;refresh(window);return 0;
    case WM_ACTIVATE:
        if(LOWORD(wParam)==WA_INACTIVE)cancel(window,L"Focus lost: stroke canceled.");
        return 0;
    case WM_KILLFOCUS:cancel(window,L"Focus changed: stroke canceled.");return 0;
    case WM_PAINT:paint(window);return 0;
    case WM_DESTROY:capture.cancel();PostQuitMessage(0);return 0;
    default:return DefWindowProcW(window,type,wParam,lParam);
    }
}
}
int WINAPI wWinMain(HINSTANCE instance,HINSTANCE,PWSTR,int show) {
    SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
    WNDCLASSW type{};type.lpfnWndProc=windowProc;type.hInstance=instance;
    type.lpszClassName=L"UnrulyNativeInputDiagnostic";type.hCursor=LoadCursorW(nullptr,IDC_ARROW);
    if(!RegisterClassW(&type)){errorBox(L"Register diagnostic window");return 1;}
    HWND window=CreateWindowExW(0,type.lpszClassName,L"UNRULY — native Windows pen slice (P0a-WIN-D1)",
        WS_OVERLAPPEDWINDOW,CW_USEDEFAULT,CW_USEDEFAULT,1000,700,nullptr,nullptr,instance,nullptr);
    if(!window){errorBox(L"Create diagnostic window");return 1;}
    ShowWindow(window,show);UpdateWindow(window);
    MSG event{};BOOL result;
    while((result=GetMessageW(&event,nullptr,0,0))>0){TranslateMessage(&event);DispatchMessageW(&event);}
    if(result==-1){errorBox(L"Windows event loop");return 1;}
    return static_cast<int>(event.wParam);
}
