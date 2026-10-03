#define P0_MODEL_ONLY
#include "../main.cpp"
#include <cstdio>

static int g_fail = 0;
#define CHECK(id, cond) do { if (!(cond)) { std::printf("FAIL %s: %s\n", id, #cond); ++g_fail; } } while (0)

static const std::size_t kLimit = 8000;

static void cap01_append_fills_last_slot() {
    Capture c;
    CHECK("QA-CAP-01", c.begin(1.0, 1.0, 0.5));
    for (std::size_t i = 1; i < kLimit; ++i) {
        CHECK("QA-CAP-01", c.append(1.0 + (double)i, 1.0, 0.5));
    }
    CHECK("QA-CAP-01", c.samples.size() == kLimit);
    CHECK("QA-CAP-01", c.full == true);
    CHECK("QA-CAP-01", c.active == false);
    CHECK("QA-CAP-01", !c.append(2.0, 2.0, 0.5));
    CHECK("QA-CAP-01", !c.begin(3.0, 3.0, 0.5));
    CHECK("QA-CAP-01", c.samples.size() == kLimit);
    std::printf("DONE QA-CAP-01 size=%zu full=%d active=%d\n", c.samples.size(), (int)c.full, (int)c.active);
}

static void cap02_begin_fills_last_slot() {
    Capture c;
    CHECK("QA-CAP-02", c.begin(1.0, 1.0, 0.5));
    for (std::size_t i = 1; i < kLimit - 1; ++i) {
        CHECK("QA-CAP-02", c.append(1.0 + (double)i, 1.0, 0.5));
    }
    c.end();
    CHECK("QA-CAP-02", c.samples.size() == kLimit - 1);
    CHECK("QA-CAP-02", c.full == false);
    CHECK("QA-CAP-02", c.begin(5.0, 5.0, 0.5));
    CHECK("QA-CAP-02", c.samples.size() == kLimit);
    CHECK("QA-CAP-02", c.full == true);
    CHECK("QA-CAP-02", c.active == false);
    CHECK("QA-CAP-02", !c.append(6.0, 6.0, 0.5));
    CHECK("QA-CAP-02", c.samples.size() == kLimit);
    std::printf("DONE QA-CAP-02 size=%zu full=%d active=%d\n", c.samples.size(), (int)c.full, (int)c.active);
}

int main() {
    cap01_append_fills_last_slot();
    cap02_begin_fills_last_slot();
    std::printf("RESULT %s, %d failed checks; model only\n", g_fail ? "FAIL" : "PASS", g_fail);
    return g_fail ? 1 : 0;
}
