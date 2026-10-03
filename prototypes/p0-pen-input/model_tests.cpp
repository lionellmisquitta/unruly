#define P0_MODEL_ONLY
#include "main.cpp"
#include <iostream>
#include <limits>
#include <stdexcept>
#include <string>

static int passed = 0, failed = 0;
static void require(bool v, const char *why) { if (!v) throw std::runtime_error(why); }
template<class F> void test(const char *id, F f) {
    try { f(); ++passed; std::cout << "PASS " << id << "\n"; }
    catch (const std::exception &e) { ++failed; std::cout << "FAIL " << id << ": " << e.what() << "\n"; }
}
int main() {
    test("P0-M01 idle hover and repeated end", [] {
        Capture c; require(!c.append(1,2,0.5), "idle appended"); c.end(); c.end();
        require(c.samples.empty() && !c.active, "idle state changed");
    });
    test("P0-M02 distinct strokes and release", [] {
        Capture c; require(c.begin(1,2,0.5) && c.append(2,3,0.7), "stroke failed"); c.end();
        require(!c.append(3,4,0), "post-release hover appended");
        require(c.begin(100,200,0.6), "second press failed");
        require(c.samples.size()==3 && c.samples[0].stroke==c.samples[1].stroke && c.samples[2].stroke!=c.samples[1].stroke, "stroke bridge");
    });
    test("P0-M03 pressure endpoints and exact values", [] {
        Capture c; require(c.begin(-10,12,0) && c.append(13,-14,1), "valid endpoints rejected");
        require(c.samples[0].pressure==0 && c.samples[1].pressure==1 && c.samples[0].x==-10 && c.samples[1].y==-14, "sample altered");
    });
    test("P0-M04 invalid press is rejected", [] {
        const double n=std::numeric_limits<double>::quiet_NaN(), i=std::numeric_limits<double>::infinity();
        const double bad[][3]={{n,1,.5},{i,1,.5},{-i,1,.5},{1,n,.5},{1,i,.5},{1,-i,.5},{1,1,n},{1,1,i},{1,1,-i},{1,1,-.001},{1,1,1.001}};
        for(auto &v:bad) { Capture c; require(!c.begin(v[0],v[1],v[2]), "invalid press accepted"); require(c.samples.empty() && !c.active && c.stroke==0, "invalid press mutated capture"); }
    });
    test("P0-M05 invalid move does not append", [] {
        const double n=std::numeric_limits<double>::quiet_NaN(), i=std::numeric_limits<double>::infinity();
        const double bad[][3]={{n,1,.5},{i,1,.5},{-i,1,.5},{1,n,.5},{1,i,.5},{1,-i,.5},{1,1,n},{1,1,i},{1,1,-i},{1,1,-.001},{1,1,1.001}};
        Capture c; c.begin(1,1,.5);
        for(auto &v:bad) require(!c.append(v[0],v[1],v[2]) && c.samples.size()==1, "invalid move accepted");
        require(c.append(2,2,.5), "valid recovery rejected");
    });
    test("P0-M06 replacement press terminates old stroke", [] {
        Capture c; c.begin(1,1,.2); c.begin(3,3,.3);
        require(c.samples.size()==2 && c.samples[0].stroke!=c.samples[1].stroke, "replacement press bridged");
        require(!c.begin(1,1,-1) && !c.active && !c.append(2,2,.5), "invalid replacement continued old stroke");
    });
    test("P0-M07 exact capacity and overflow", [] {
        Capture c; c.begin(0,0,.5);
        for(std::size_t j=1;j<Capture::limit;++j) require(c.append(static_cast<double>(j),static_cast<double>(j),.5), "early capacity stop");
        require(c.samples.size()==Capture::limit, "capacity mismatch");
        require(!c.append(8000,8000,.5) && c.full && !c.active, "overflow did not stop capture");
        require(!c.begin(1,1,.5) && c.samples.size()==Capture::limit, "full press escaped bound");
    });
    test("P0-M08 clear recovery from full", [] {
        Capture c; c.begin(0,0,.5); for(std::size_t j=1;j<Capture::limit;++j) c.append(static_cast<double>(j),static_cast<double>(j),.5); c.append(1,1,.5);
        c.clear(); c.clear(); require(c.samples.empty() && !c.active && !c.full && c.stroke==0, "clear incomplete");
        require(!c.append(1,1,.5) && c.begin(2,2,1) && c.samples.size()==1 && c.stroke==1, "clear recovery failed");
    });
    test("P0-M09 end preserves ink and splits resumed stroke", [] {
        Capture c; c.begin(1,1,.5); c.end(); require(!c.append(2,2,.5) && c.samples.size()==1, "end did not stop");
        c.begin(3,3,.5); require(c.samples[0].stroke!=c.samples[1].stroke, "resumed stroke bridged");
    });
    test("P0-M10 repeated capacity clear cycles", [] {
        Capture c; for(int k=0;k<3;++k) { c.begin(0,0,0); for(std::size_t j=1;j<Capture::limit;++j) require(c.append(static_cast<double>(j),-static_cast<double>(j),1), "cycle fill failed"); require(!c.append(0,0,.5), "cycle overflow"); c.clear(); }
        require(c.samples.empty() && !c.full && !c.active, "cycle leaked state");
    });
    // Risk reproduction, NOT a passing UI test: the model has no contact/buttons input.
    Capture risk; risk.begin(1,1,.5); bool accepted=risk.append(200,200,0);
    std::cout << "OBSERVATION missing-release zero-pressure move accepted=" << accepted << " samples=" << risk.samples.size() << " (UI contact guard requires native verification)\n";
    std::cout << "RESULT " << passed << " passed, " << failed << " failed; model only\n";
    return failed ? 1 : 0;
}
