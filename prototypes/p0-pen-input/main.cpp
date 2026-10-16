// Quarantined feasibility probe. Never promote this renderer into production.
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <vector>

struct Sample { double x, y, pressure; std::uint64_t stroke; };
class Capture {
public:
    static constexpr std::size_t limit = 8000;
    std::vector<Sample> samples;
    bool active = false;
    bool full = false;
    std::uint64_t stroke = 0;
    bool begin(double x, double y, double pressure) {
        active = false;
        if (!valid(x, y, pressure) || samples.size() >= limit) {
            full = samples.size() >= limit;
            return false;
        }
        ++stroke;
        active = true;
        return append(x, y, pressure);
    }
    bool append(double x, double y, double pressure) {
        if (!active || !valid(x, y, pressure)) return false;
        if (samples.size() >= limit) { full = true; active = false; return false; }
        samples.push_back({x, y, pressure, stroke});
        // Reaching the bound must stop capture and show the limit immediately.
        if (samples.size() == limit) { full = true; active = false; }
        return true;
    }
    void end() { active = false; }
    void clear() { samples.clear(); active = false; full = false; stroke = 0; }
private:
    static bool valid(double x, double y, double p) {
        return std::isfinite(x) && std::isfinite(y) && std::isfinite(p)
            && p >= 0 && p <= 1;
    }
};

#ifndef P0_MODEL_ONLY
#include <QApplication>
#include <QEvent>
#include <QFocusEvent>
#include <QLabel>
#include <QPainter>
#include <QPushButton>
#include <QTabletEvent>
#include <QVBoxLayout>
#include <QWidget>

class Pad final : public QWidget {
public:
    Capture capture;
    QLabel *status;
    explicit Pad(QLabel *label) : status(label) {
        setMinimumSize(300, 300);
        setFocusPolicy(Qt::StrongFocus);
        // Deliver buttonless hover moves so the lost-release guard can end ink.
        setTabletTracking(true);
        setAutoFillBackground(true);
        auto colors = palette(); colors.setColor(QPalette::Window, Qt::white);
        setPalette(colors);
    }
    void reset() { capture.clear(); status->setText("Cleared. Draw with the pen."); update(); }
protected:
    void tabletEvent(QTabletEvent *event) override {
        const auto p = event->position();
        bool added = false;
        if (event->type() == QEvent::TabletPress) {
            setFocus();
            if (event->buttons().testFlag(Qt::LeftButton))
                added = capture.begin(p.x(), p.y(), event->pressure());
            else capture.end();
        } else if (event->type() == QEvent::TabletMove) {
            // A lost release must not turn subsequent hover into an ink bridge.
            if (event->buttons().testFlag(Qt::LeftButton))
                added = capture.append(p.x(), p.y(), event->pressure());
            else capture.end();
        } else if (event->type() == QEvent::TabletRelease) {
            // Avoid a release-pressure-zero tail. This probe preserves move samples only.
            capture.end();
        }
        status->setText(QString("Samples %1 / 8000 | pressure %2 | tilt %3,%4 | %5")
            .arg(static_cast<qulonglong>(capture.samples.size()))
            .arg(event->pressure(), 0, 'f', 3).arg(event->xTilt()).arg(event->yTilt())
            .arg(capture.full ? "LIMIT: Clear to continue" : "raw input"));
        event->accept(); // Do not draw a duplicate synthesized mouse stroke.
        if (added) update();
    }
    bool event(QEvent *event) override {
        if (event->type() == QEvent::WindowDeactivate || event->type() == QEvent::Hide)
            capture.end();
        return QWidget::event(event);
    }
    void focusOutEvent(QFocusEvent *event) override { capture.end(); QWidget::focusOutEvent(event); }
    void paintEvent(QPaintEvent *) override {
        QPainter painter(this);
        painter.setRenderHint(QPainter::Antialiasing);
        painter.setClipRect(rect());
        for (std::size_t i = 0; i < capture.samples.size(); ++i) {
            const auto &s = capture.samples[i];
            const qreal width = 1.0 + 11.0 * s.pressure;
            painter.setPen(QPen(QColor("#17223b"), width, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin));
            const QPointF current(s.x, s.y);
            if (i > 0 && capture.samples[i - 1].stroke == s.stroke) {
                const auto &previous = capture.samples[i - 1];
                painter.drawLine(QPointF(previous.x, previous.y), current);
            } else { painter.drawPoint(current); }
        }
    }
};

int main(int argc, char **argv) {
    QApplication app(argc, argv);
    QWidget window;
    window.setWindowTitle("UNRULY P0 — raw pen probe (not the app)");
    auto *layout = new QVBoxLayout(&window);
    auto *label = new QLabel("Draw with pen. Fingers/mouse do not ink. No save, sync or AI.");
    label->setWordWrap(true);
    auto *pad = new Pad(label);
    auto *clear = new QPushButton("Clear probe");
    QObject::connect(clear, &QPushButton::clicked, pad, [pad] { pad->reset(); });
    layout->addWidget(label); layout->addWidget(pad, 1); layout->addWidget(clear);
    window.resize(1000, 700); window.show();
    return app.exec();
}
#endif
