// Independent QA-owned P0a-WIN-D1 tests. No Windows/device coverage implied.
#include "capture_model.hpp"
#include <iostream>
#include <limits>
#include <stdexcept>
#include <string>

namespace {
void require(bool ok,const char* reason) { if(!ok)throw std::runtime_error(reason); }
void W01() {
    Capture c;
    require(c.samples.empty()&&!c.active&&!c.full,"initial state");
    require(!c.append(7,0,0,true,0.5),"append without contact");
    c.end(7);c.cancel();
    require(c.samples.empty()&&!c.active&&!c.full,"empty lifecycle must preserve state");
}
void W02() {
    Capture c;
    require(c.begin(7,-10,0,true,0),"zero pressure valid");
    require(c.append(7,20,-30,true,1),"max pressure valid");
    require(c.samples.size()==2,"two valid samples");
    const auto first=c.samples.front();
    require(first.x==-10&&first.y==0&&first.pressureKnown&&first.pressure==0&&first.pointerId==7,"first data exact");
    require(c.samples.back().x==20&&c.samples.back().y==-30&&c.samples.back().pressure==1,"last data exact");
    require(c.samples.back().stroke==first.stroke,"one contact one identity");
    c.end(7);require(!c.active,"release ends contact");
    require(c.begin(7,100,200,true,0.3),"second contact valid");
    require(c.samples.back().stroke!=first.stroke,"contacts must not bridge");
}
void W03() {
    Capture c;const double nan=std::numeric_limits<double>::quiet_NaN();
    require(c.begin(7,0,0,false,nan),"unknown pressure may have nonfinite unused payload");
    require(!c.samples.back().pressureKnown,"unknown not fabricated");
    require(c.append(7,1,1,false,9999),"unknown payload is not known pressure");
    require(!c.samples.back().pressureKnown,"unknown flag retained");
    require(c.append(7,2,2,true,0.6),"pressure becomes known");
    require(c.samples.back().pressureKnown&&c.samples.back().pressure==0.6,"known sample preserved");
}
void W04() {
    const double values[]={std::numeric_limits<double>::quiet_NaN(),std::numeric_limits<double>::infinity(),-std::numeric_limits<double>::infinity()};
    for(double v:values)for(int axis=0;axis<2;++axis) {
        Capture c;const double x=axis==0?v:0,y=axis==1?v:0;
        require(!c.begin(7,x,y,true,0.5),"nonfinite coordinate begin reject");
        require(c.samples.empty()&&!c.active,"invalid begin no mutation");
        require(c.begin(7,10,20,true,0.5),"recover after invalid begin");
        const auto prior=c.samples.back();
        require(!c.append(7,x,y,true,0.5),"nonfinite coordinate append reject");
        require(c.samples.size()==1&&c.active&&c.samples.back().stroke==prior.stroke,"invalid append preserves contact");
        require(c.append(7,11,21,true,0.5),"valid append after rejection");
    }
}
void W05() {
    const double values[]={std::numeric_limits<double>::quiet_NaN(),std::numeric_limits<double>::infinity(),-std::numeric_limits<double>::infinity(),-0.01,1.01};
    for(double v:values) {
        Capture c;
        require(!c.begin(7,0,0,true,v),"invalid known pressure begin reject");
        require(c.samples.empty()&&!c.active,"invalid pressure begin no mutation");
        require(c.begin(7,0,0,true,0),"begin after invalid pressure");
        require(!c.append(7,1,1,true,v),"invalid known pressure append reject");
        require(c.samples.size()==1&&c.active,"invalid pressure append no mutation");
        require(c.append(7,2,2,true,1),"append pressure endpoint");
    }
}
void W06() {
    Capture c;require(c.begin(7,0,0,true,0.5),"owner contact");
    const auto stroke=c.samples.back().stroke;
    require(!c.append(8,1,1,true,0.5),"wrong owner append rejected");
    c.end(8);require(c.active,"wrong owner cannot end contact");
    require(!c.begin(8,2,2,true,0.5),"second owner begin rejected");
    require(!c.begin(7,2,2,true,0.5),"duplicate begin rejected");
    require(c.samples.size()==1&&c.samples.back().pointerId==7,"ownership preserved");
    require(c.append(7,3,3,true,0.5)&&c.samples.back().stroke==stroke,"original owner still writes");
}
void W07() {
    Capture c;require(c.begin(7,0,0,true,0.5),"contact");
    const auto stroke=c.samples.back().stroke;
    c.cancel();c.cancel();require(!c.active&&c.samples.size()==1,"cancel idempotent preserves ink");
    require(!c.append(7,1,1,true,0.5),"postcancel append rejected");
    require(c.begin(8,2,2,true,0.5),"new contact after cancel");
    require(c.samples.back().stroke!=stroke&&c.samples.back().pointerId==8,"new identity after cancel");
}
void W08() {
    Capture c;require(c.begin(7,0,0,true,0.5),"capacity start");
    while(c.samples.size()<Capture::capacity-1)require(c.append(7,1,1,true,0.5),"fill to 7999");
    require(c.samples.size()==7999&&c.active&&!c.full,"7999 not full");
    require(c.append(7,2,2,true,1),"8000 accepted");
    require(c.samples.size()==8000&&c.full&&!c.active,"stop immediately at 8000");
    require(!c.append(7,3,3,true,1),"8001 rejected");
    require(!c.begin(8,3,3,true,1),"new contact cannot exceed capacity");
    c.cancel();c.end(7);require(c.samples.size()==8000&&c.full&&!c.active,"limit preserved through end cancel");
    c.clear();require(c.begin(8,0,0,false,0),"clear recovers capacity");
    require(c.samples.size()==1&&!c.full&&c.active,"recovered state");
}
void W09() {
    Capture c;require(c.begin(7,0,0,true,0.5),"clear contact");
    c.clear();c.clear();require(c.samples.empty()&&!c.active&&!c.full,"clear resets idempotently");
    require(!c.append(7,1,1,true,0.5),"old contact cannot append after clear");
    require(c.begin(8,2,2,true,0.5),"new contact after clear");
    require(c.samples.size()==1&&c.samples.front().pointerId==8,"clear recovery owner");
}
}
int main() {
    const struct { const char* id;void(*run)(); } tests[]={
        {"W01",W01},{"W02",W02},{"W03",W03},{"W04",W04},{"W05",W05},
        {"W06",W06},{"W07",W07},{"W08",W08},{"W09",W09}
    };
    unsigned failed=0;
    for(const auto& test:tests)try {test.run();std::cout<<test.id<<" PASS\n";}
    catch(const std::exception& e) {++failed;std::cerr<<test.id<<" FAIL: "<<e.what()<<'\n';}
    std::cout<<"cases="<<9<<" passed="<<(9-failed)<<" failed="<<failed<<'\n';
    return failed==0?0:1;
}
