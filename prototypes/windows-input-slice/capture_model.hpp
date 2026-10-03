#pragma once
#include <cmath>
#include <cstdint>
#include <vector>

struct Sample {
    double x, y;
    bool pressureKnown;
    double pressure;
    std::uint64_t stroke;
    std::uint32_t pointerId;
};
class Capture {
public:
    static constexpr std::size_t capacity = 8000;
    std::vector<Sample> samples;
    bool active = false;
    bool full = false;
    bool begin(std::uint32_t id, double x, double y, bool known, double pressure) {
        if (active || !valid(x,y,known,pressure)) return false;
        if (samples.size() >= capacity) { full=true; return false; }
        pointerId_=id;
        ++stroke_;
        active=true;
        return append(id,x,y,known,pressure);
    }
    bool append(std::uint32_t id, double x, double y, bool known, double pressure) {
        if (!active || id!=pointerId_ || !valid(x,y,known,pressure)) return false;
        if (samples.size()>=capacity) { full=true; active=false; return false; }
        samples.push_back({x,y,known,known?pressure:0.0,stroke_,id});
        if (samples.size()==capacity) { full=true; active=false; }
        return true;
    }
    void end(std::uint32_t id) { if (active && id==pointerId_) active=false; }
    void cancel() { active=false; }
    void clear() { samples.clear(); active=false; full=false; stroke_=0; pointerId_=0; }
private:
    std::uint32_t pointerId_=0;
    std::uint64_t stroke_=0;
    static bool valid(double x,double y,bool known,double pressure) {
        return std::isfinite(x) && std::isfinite(y)
            && (!known || (std::isfinite(pressure) && pressure>=0.0 && pressure<=1.0));
    }
};
