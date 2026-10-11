// Diagnostic only: not an acceptance-test replacement.
#define main p0_probe_main
#include "../main.cpp"
#undef main
#include <QPointingDevice>
#include <iostream>
int main(int argc, char **argv) {
 QApplication app(argc,argv);
 QPointingDevice d("synthetic-diagnostic",99,QInputDevice::DeviceType::Stylus,QPointingDevice::PointerType::Pen,QInputDevice::Capability::Position | QInputDevice::Capability::Pressure,1,1);
 for(bool shown : {false,true}) for(bool enable : {false,true}) {
  QLabel label; Pad pad(&label); if(enable) pad.setTabletTracking(true);
  if(shown){pad.show();app.processEvents();}
  QTabletEvent press(QEvent::TabletPress,&d,QPointF(10,10),QPointF(10,10),.5,0,0,0,0,0,Qt::NoModifier,Qt::LeftButton,Qt::LeftButton);
  QApplication::sendEvent(&pad,&press);
  QTabletEvent hover(QEvent::TabletMove,&d,QPointF(20,20),QPointF(20,20),0,0,0,0,0,0,Qt::NoModifier,Qt::NoButton,Qt::NoButton);
  hover.setAccepted(false);QApplication::sendEvent(&pad,&hover);
  std::cout << "DIAGNOSTIC shown=" << shown << " tracking=" << pad.hasTabletTracking() << " hoverAccepted=" << hover.isAccepted() << " activeAfterHover=" << pad.capture.active << " samples=" << pad.capture.samples.size() << "\n";
 }
 return 0;
}
