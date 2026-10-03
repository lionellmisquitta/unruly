#define P0_MODEL_ONLY
#include "../main.cpp"
#include <cmath>
#include <iostream>
#include <limits>
#include <stdexcept>

static int passed = 0, failed = 0;
static void req(bool v, const char *why) { if (!v) throw std::runtime_error(why); }
template<class F> void test(const char *id, F f) {
    try { f(); ++passed; std::cout << "PASS " << id << "\n"; }
    catch (const std::exception &e) { ++failed; std::cout << "FAIL " << id << ": " << e.what() << "\n"; }
}
static void fill(Capture &c, std::size_t n) {
    c.begin(0, 0, .5);
    for (std::size_t j = 1; j < n; ++j) c.append(static_cast<double>(j), 0, .5);
}

int main() {
    const double nan = std::numeric_limits<double>::quiet_NaN();
    test("QA-A02 invalid press mid-stroke ends stroke, id unchanged", [&] {
        Capture c; req(c.begin(1, 1, .5), "begin");
        req(!c.begin(nan, 1, .5) && !c.active && c.stroke == 1, "invalid press mutated");
        req(!c.append(2, 2, .5) && c.samples.size() == 1, "bridge after invalid press");
        req(c.begin(3, 3, .5) && c.stroke == 2 && c.samples[1].stroke == 2, "next stroke id");
    });
    test("QA-A03 full stays full on invalid and valid press", [] {
        Capture c; fill(c, Capture::limit); c.append(1, 1, .5);
        req(c.full, "not full");
        req(!c.begin(1, 1, 2.0) && c.full && !c.active, "invalid press cleared full");
        req(!c.begin(1, 1, .5) && c.full && c.samples.size() == Capture::limit, "bound escaped");
    });
    test("QA-A04 extreme finite values preserved exactly", [] {
        Capture c; const double big = std::numeric_limits<double>::max();
        const double den = std::numeric_limits<double>::denorm_min();
        req(c.begin(-big, big, den) && c.append(-0.0, den, 1.0), "finite rejected");
        req(c.samples[0].x == -big && c.samples[0].y == big && c.samples[0].pressure == den, "altered");
        req(std::signbit(c.samples[1].x), "-0 sign lost");
    });
    test("QA-A05 pressure one ulp outside range rejected", [] {
        Capture c; req(!c.begin(1, 1, std::nextafter(1.0, 2.0)), "p>1 press");
        req(!c.begin(1, 1, std::nextafter(0.0, -1.0)), "p<0 press");
        req(c.begin(1, 1, std::nextafter(1.0, 0.0)), "just-below-1 rejected");
        req(!c.append(1, 1, std::nextafter(1.0, 2.0)) && c.samples.size() == 1, "p>1 move");
    });
    test("QA-A06 stroke ids strictly increase across 500 presses", [] {
        Capture c;
        for (int k = 0; k < 500; ++k) { req(c.begin(k, k, .5), "press"); c.append(k, k + 1, .5); c.end(); }
        for (std::size_t i = 2; i < c.samples.size(); i += 2)
            req(c.samples[i].stroke == c.samples[i - 1].stroke + 1, "id not monotonic");
    });
    test("QA-A07 begin at limit-1 accepted, then append overflows", [] {
        Capture c; fill(c, Capture::limit - 1); c.end();
        req(c.begin(5, 5, .5) && c.samples.size() == Capture::limit, "last slot press");
        req(!c.append(6, 6, .5) && c.full && !c.active, "overflow not stopped");
        req(c.samples.back().stroke == c.stroke, "last stroke id");
    });
    test("QA-A08 clear mid-stroke kills active stroke", [] {
        Capture c; c.begin(1, 1, .5); c.append(2, 2, .5); c.clear();
        req(!c.append(3, 3, .5) && c.samples.empty(), "append after clear");
        req(c.begin(4, 4, .5) && c.stroke == 1, "stroke not reset");
    });
    test("QA-A09 invalid moves keep stroke, valid move continues it", [&] {
        Capture c; c.begin(1, 1, .5);
        for (int k = 0; k < 100; ++k) req(!c.append(nan, k, .5), "nan accepted");
        req(c.active && c.append(2, 2, .5) && c.samples.size() == 2, "recovery");
        req(c.samples[0].stroke == c.samples[1].stroke, "split by invalid");
    });
    test("QA-A10 multi-stroke fill never exceeds limit", [] {
        Capture c; std::size_t ok = 0;
        for (int s = 0; s < 100; ++s) {
            if (c.begin(s, 0, .5)) ++ok;
            for (int j = 0; j < 99; ++j) if (c.append(s, j, .5)) ++ok;
            c.end();
        }
        req(ok == Capture::limit && c.samples.size() == Capture::limit && c.full, "bound");
        req(c.samples.back().stroke == 80, "stroke at limit");
    });
    Capture o; fill(o, Capture::limit);
    std::cout << "OBSERVATION QA-A01 size=" << o.samples.size() << " full=" << o.full
              << " (QA-F01: full lags until next rejected input)\n";
    std::cout << "RESULT " << passed << " passed, " << failed << " failed; model only, proposed\n";
    return failed ? 1 : 0;
}
