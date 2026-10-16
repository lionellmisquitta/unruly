// qa-native-wslg/p0_native_adapter_tests.cpp  (C++17, no Q_OBJECT/moc, no product edits)
#define main p0_probe_main
#include "../main.cpp"
#undef main

#include <QHideEvent>
#include <QMouseEvent>
#include <QPointingDevice>
#include <cmath>
#include <iostream>
#include <limits>
#include <string>
#include <vector>

namespace {
using Fails = std::vector<std::string>;
constexpr double kNaN = std::numeric_limits<double>::quiet_NaN();
constexpr double kInf = std::numeric_limits<double>::infinity();

struct Fx {
    QLabel label;
    Pad pad{&label};
};

bool tab(Pad &pad, const QPointingDevice *dev, QEvent::Type type, double x, double y,
         double pressure, Qt::MouseButton button, Qt::MouseButtons buttons) {
    QTabletEvent ev(type, dev, QPointF(x, y), QPointF(x, y), pressure, 3.0f, -4.0f, 0.0f,
                    0.0, 0.0f, Qt::NoModifier, button, buttons);
    ev.setAccepted(false);
    QApplication::sendEvent(&pad, &ev);
    return ev.isAccepted();
}
bool press(Pad &p, const QPointingDevice *d, double x, double y, double pr) {
    return tab(p, d, QEvent::TabletPress, x, y, pr, Qt::LeftButton, Qt::LeftButton);
}
bool move(Pad &p, const QPointingDevice *d, double x, double y, double pr) {
    return tab(p, d, QEvent::TabletMove, x, y, pr, Qt::NoButton, Qt::LeftButton);
}
bool hover(Pad &p, const QPointingDevice *d, double x, double y, double pr) {
    return tab(p, d, QEvent::TabletMove, x, y, pr, Qt::NoButton, Qt::NoButton);
}
bool release(Pad &p, const QPointingDevice *d, double x, double y, double pr) {
    return tab(p, d, QEvent::TabletRelease, x, y, pr, Qt::LeftButton, Qt::NoButton);
}
bool has(const QString &s, const char *needle) { return s.contains(QString::fromUtf8(needle)); }

Fails t001(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    ck(press(x.pad, d, 10, 10, 0.5), "press not accepted");
    ck(move(x.pad, d, 20, 20, 0.6), "move1 not accepted");
    ck(move(x.pad, d, 30, 30, 0.7), "move2 not accepted");
    ck(release(x.pad, d, 99, 99, 0.0), "release not accepted");
    ck(c.samples.size() == 3, "expected exactly 3 samples after release");
    bool zero = false, tail = false;
    for (const auto &s : c.samples) { if (s.pressure == 0.0) zero = true; if (s.x == 99 && s.y == 99) tail = true; }
    ck(!zero, "zero-pressure sample present");
    ck(!tail, "release position recorded as sample");
    ck(!c.active, "capture still active after release");
    ck(!c.full, "unexpected full flag");
    move(x.pad, d, 40, 40, 0.5);
    ck(c.samples.size() == 3, "left move after release added a sample");
    return f;
}

Fails t002(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    hover(x.pad, d, 5, 5, 0.3);
    ck(c.samples.empty(), "hover with no press added a sample");
    ck(!c.active, "hover activated capture");
    ck(c.stroke == 0, "hover advanced stroke counter");
    press(x.pad, d, 10, 10, 0.5);
    move(x.pad, d, 20, 20, 0.5);
    ck(c.samples.size() == 2, "setup stroke should have 2 samples");
    hover(x.pad, d, 30, 30, 0.5);
    ck(c.samples.size() == 2, "hover mid-stroke added a sample");
    ck(!c.active, "hover mid-stroke did not end capture");
    move(x.pad, d, 40, 40, 0.5);
    ck(c.samples.size() == 2, "left move after hover bridged ink");
    press(x.pad, d, 50, 50, 0.5);
    ck(c.samples.size() == 3, "fresh press not recorded");
    ck(c.samples.size() == 3 && c.samples[2].stroke == 2, "fresh press did not get stroke id 2");
    return f;
}

Fails t003(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    press(x.pad, d, kNaN, 10, 0.5);
    press(x.pad, d, 10, 10, 1.5);
    press(x.pad, d, 10, 10, -0.1);
    press(x.pad, d, 10, kInf, 0.5);
    ck(c.samples.empty(), "invalid press added a sample");
    ck(c.stroke == 0, "invalid press advanced stroke counter");
    ck(!c.active, "invalid press activated capture");
    press(x.pad, d, 5, 5, 0.5);
    move(x.pad, d, 6, 6, kNaN);
    move(x.pad, d, 7, 7, 2.0);
    ck(c.samples.size() == 1, "invalid move added a sample");
    ck(c.active, "invalid move ended an otherwise valid stroke");
    move(x.pad, d, 8, 8, 0.4);
    ck(c.samples.size() == 2, "valid move after invalid move not recorded");
    press(x.pad, d, kNaN, kNaN, 0.5);
    ck(!c.active, "invalid press mid-stroke left capture active");
    ck(c.samples.size() == 2, "invalid press mid-stroke changed samples");
    return f;
}

Fails t004(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    for (int way = 0; way < 3; ++way) {
        Fx x; auto &c = x.pad.capture;
        press(x.pad, d, 10, 10, 0.5);
        move(x.pad, d, 20, 20, 0.5);
        ck(c.active && c.samples.size() == 2, "setup stroke not active");
        if (way == 0) { QFocusEvent e(QEvent::FocusOut, Qt::OtherFocusReason); QApplication::sendEvent(&x.pad, &e); }
        else if (way == 1) { QEvent e(QEvent::WindowDeactivate); QApplication::sendEvent(&x.pad, &e); }
        else { QHideEvent e; QApplication::sendEvent(&x.pad, &e); }
        ck(!c.active, way == 0 ? "FocusOut did not end capture" : way == 1 ? "WindowDeactivate did not end capture" : "Hide did not end capture");
        move(x.pad, d, 30, 30, 0.5);
        ck(c.samples.size() == 2, "left move after interruption added a sample without a new press");
    }
    return f;
}

Fails t005(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    press(x.pad, d, 1, 1, 0.5);
    for (int i = 1; i < 7999; ++i) move(x.pad, d, i % 200, i % 150, 0.5);
    ck(c.samples.size() == 7999, "expected 7999 samples before the bound");
    ck(!c.full && c.active, "7999 samples should be neither full nor inactive");
    ck(!has(x.label.text(), "LIMIT"), "limit status shown too early");
    move(x.pad, d, 3, 3, 0.5);
    ck(c.samples.size() == 8000, "expected 8000 samples at the bound");
    ck(c.full, "full flag not set at 8000");
    ck(!c.active, "capture still active at 8000");
    ck(has(x.label.text(), "LIMIT: Clear to continue"), "limit status not shown immediately");
    move(x.pad, d, 4, 4, 0.5);
    press(x.pad, d, 5, 5, 0.5);
    ck(c.samples.size() == 8000, "samples exceeded 8000");
    ck(c.stroke == 1, "press at the limit advanced stroke counter");
    x.pad.reset();
    ck(c.samples.empty() && !c.full && !c.active && c.stroke == 0, "reset did not clear capture state");
    ck(x.label.text() == QString("Cleared. Draw with the pen."), "reset status text wrong");
    press(x.pad, d, 9, 9, 0.5);
    ck(c.samples.size() == 1, "press after reset not recorded");
    ck(has(x.label.text(), "raw input"), "status after reset did not return to raw input");
    return f;
}

Fails t006(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    ck(press(x.pad, d, 10, 10, 0.5), "tablet press not accepted");
    ck(move(x.pad, d, 20, 20, 0.5), "tablet move not accepted");
    ck(hover(x.pad, d, 30, 30, 0.5), "tablet hover not accepted");
    ck(release(x.pad, d, 30, 30, 0.0), "tablet release not accepted");
    x.pad.reset();
    QMouseEvent mp(QEvent::MouseButtonPress, QPointF(5, 5), QPointF(5, 5), Qt::LeftButton, Qt::LeftButton, Qt::NoModifier);
    QMouseEvent mm(QEvent::MouseMove, QPointF(6, 6), QPointF(6, 6), Qt::NoButton, Qt::LeftButton, Qt::NoModifier);
    QApplication::sendEvent(&x.pad, &mp);
    QApplication::sendEvent(&x.pad, &mm);
    ck(c.samples.empty(), "idle mouse events produced samples");
    ck(!c.active, "mouse press activated capture");
    press(x.pad, d, 10, 10, 0.5);
    QMouseEvent mp2(QEvent::MouseButtonPress, QPointF(50, 50), QPointF(50, 50), Qt::LeftButton, Qt::LeftButton, Qt::NoModifier);
    QMouseEvent mm2(QEvent::MouseMove, QPointF(60, 60), QPointF(60, 60), Qt::NoButton, Qt::LeftButton, Qt::NoModifier);
    QApplication::sendEvent(&x.pad, &mp2);
    QApplication::sendEvent(&x.pad, &mm2);
    ck(c.samples.size() == 1, "mouse events added samples during a tablet stroke");
    return f;
}

Fails t007(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    press(x.pad, d, 10, 10, 0.5); move(x.pad, d, 11, 11, 0.5); release(x.pad, d, 11, 11, 0.0);
    press(x.pad, d, 100, 100, 0.5); move(x.pad, d, 101, 101, 0.5);
    ck(c.samples.size() == 4, "expected 4 samples across two strokes");
    if (c.samples.size() == 4) {
        ck(c.samples[0].stroke == 1 && c.samples[1].stroke == 1, "first stroke ids wrong");
        ck(c.samples[2].stroke == 2 && c.samples[3].stroke == 2, "second stroke ids wrong");
    }
    tab(x.pad, d, QEvent::TabletPress, 200, 200, 0.5, Qt::RightButton, Qt::RightButton);
    ck(!c.active, "right-button press did not end capture");
    ck(c.samples.size() == 4, "right-button press added a sample");
    press(x.pad, d, 120, 120, 0.5);
    ck(c.active, "setup press for no-button check failed");
    tab(x.pad, d, QEvent::TabletPress, 130, 130, 0.5, Qt::NoButton, Qt::NoButton);
    ck(!c.active, "no-button press did not end capture");
    ck(c.samples.size() == 5, "no-button press added a sample");
    return f;
}

Fails t008(const QPointingDevice *d) {
    Fails f; auto ck = [&](bool c, const char *m) { if (!c) f.push_back(m); };
    Fx x; auto &c = x.pad.capture;
    press(x.pad, d, 12.5, 34.25, 0.25);
    ck(c.samples.size() == 1, "press not stored");
    if (!c.samples.empty()) {
        ck(c.samples[0].x == 12.5 && c.samples[0].y == 34.25, "position not stored exactly");
        ck(c.samples[0].pressure == 0.25, "pressure not stored exactly");
    }
    const QString s = x.label.text();
    ck(has(s, "Samples 1 / 8000"), "status missing sample count");
    ck(has(s, "pressure 0.250"), "status missing pressure");
    ck(has(s, "raw input"), "status missing raw input marker");
    move(x.pad, d, 13, 35, 0.0);
    move(x.pad, d, 14, 36, 1.0);
    ck(c.samples.size() == 3, "boundary pressures 0.0 and 1.0 on moves not accepted");
    if (c.samples.size() == 3) ck(c.samples[1].pressure == 0.0 && c.samples[2].pressure == 1.0, "boundary pressures not raw");
    return f;
}

struct Entry { const char *id; Fails (*fn)(const QPointingDevice *); };
} // namespace

int main(int argc, char **argv) {
    QApplication app(argc, argv);
    std::cout << "platform=" << QGuiApplication::platformName().toStdString() << std::endl;
    QPointingDevice dev(QString("synthetic-pen"), 1, QInputDevice::DeviceType::Stylus,
                        QPointingDevice::PointerType::Pen,
                        QInputDevice::Capabilities(QInputDevice::Capability::Position | QInputDevice::Capability::Pressure
                                                   | QInputDevice::Capability::XTilt | QInputDevice::Capability::YTilt),
                        1, 2);
    const Entry tests[] = {
        {"P0N-001", t001}, {"P0N-002", t002}, {"P0N-003", t003}, {"P0N-004", t004},
        {"P0N-005", t005}, {"P0N-006", t006}, {"P0N-007", t007}, {"P0N-008", t008}};
    int passed = 0, failed = 0;
    for (const auto &t : tests) {
        const Fails f = t.fn(&dev);
        if (f.empty()) { ++passed; std::cout << "PASS " << t.id << std::endl; }
        else {
            ++failed;
            std::cout << "FAIL " << t.id << std::endl;
            for (const auto &m : f) std::cout << "  - " << m << std::endl;
        }
    }
    std::cout << "TOTAL " << (passed + failed) << " PASS " << passed << " FAIL " << failed << std::endl;
    return failed == 0 ? 0 : 1;
}
