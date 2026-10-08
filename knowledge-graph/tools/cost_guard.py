#!/usr/bin/env python3
import argparse
import json


def band(value, limits_scores):
    for limit, score in limits_scores:
        if value <= limit:
            return score
    return limits_scores[-1][1]


def main():
    p = argparse.ArgumentParser(description='Estimate KGP workload intensity. This is not a token or monetary cost estimator.')
    p.add_argument('--source-bytes', type=int, default=0)
    p.add_argument('--files', type=int, default=0)
    p.add_argument('--graph-records', type=int, default=0)
    p.add_argument('--conversation-bytes', type=int, default=0, help='Only conversations intentionally in scope, not dormant archives')
    p.add_argument('--conversation-count', type=int, default=0, help='Only conversations intentionally in scope, not dormant archives')
    p.add_argument('--full-scan', action='store_true')
    p.add_argument('--full-rebuild', action='store_true')
    p.add_argument('--unbounded-traversal', action='store_true')
    p.add_argument('--all-evidence', action='store_true')
    p.add_argument('--ocr-heavy', action='store_true')
    p.add_argument('--entity-resolution', action='store_true')
    p.add_argument('--all-conversations', action='store_true')
    args = p.parse_args()

    mb = args.source_bytes / (1024 * 1024)
    score = 0
    reasons = []

    s = band(mb, [(5, 0), (25, 1), (100, 2), (500, 4), (10**18, 6)])
    score += s
    if s:
        reasons.append(f'{mb:.1f} MB of source material')

    s = band(args.files, [(10, 0), (50, 1), (200, 2), (1000, 4), (10**18, 6)])
    score += s
    if s:
        reasons.append(f'{args.files} source files')

    conv_mb = args.conversation_bytes / (1024 * 1024)
    s = band(conv_mb, [(5, 0), (25, 1), (100, 2), (500, 4), (10**18, 6)])
    score += s
    if s:
        reasons.append(f'{conv_mb:.1f} MB of conversation material intentionally in scope')

    s = band(args.conversation_count, [(10, 0), (50, 1), (200, 2), (1000, 4), (10**18, 6)])
    score += s
    if s:
        reasons.append(f'{args.conversation_count} conversation sessions intentionally in scope')

    s = band(args.graph_records, [(2000, 0), (10000, 1), (50000, 2), (250000, 4), (10**18, 6)])
    score += s
    if s:
        reasons.append(f'{args.graph_records} graph/knowledge records')

    flags = [
        ('full-scan', args.full_scan, 2, 'full source/conversation scan'),
        ('full-rebuild', args.full_rebuild, 4, 'full graph rebuild'),
        ('unbounded-traversal', args.unbounded_traversal, 6, 'unbounded graph traversal'),
        ('all-evidence', args.all_evidence, 2, 'all evidence requested'),
        ('ocr-heavy', args.ocr_heavy, 3, 'OCR/vision-heavy material'),
        ('entity-resolution', args.entity_resolution, 2, 'large-scale entity resolution'),
        ('all-conversations', args.all_conversations, 5, 'all raw conversations requested')
    ]
    for _, enabled, points, label in flags:
        if enabled:
            score += points
            reasons.append(label)

    if score <= 2:
        level = 'LOW'
        action = 'Proceed normally.'
    elif score <= 5:
        level = 'MODERATE'
        action = 'Proceed with bounded retrieval and delta updates.'
    elif score <= 9:
        level = 'HIGH'
        action = 'Warn the user and offer a materially cheaper scoped alternative when useful; continue unless scope materially changes.'
    else:
        level = 'EXTREME'
        action = 'Require explicit user approval before executing at this scope.'

    suggestions = []
    if args.full_rebuild:
        suggestions.append('Prefer incremental delta merge over full rebuild.')
    if args.unbounded_traversal:
        suggestions.append('Anchor the query and bound relationship types/depth.')
    if args.all_evidence:
        suggestions.append('Load only evidence supporting the relevant subgraph.')
    if args.source_bytes > 25 * 1024 * 1024 or args.files > 50:
        suggestions.append('Use hashes/search to avoid rescanning unchanged or irrelevant files.')
    if args.graph_records > 10000:
        suggestions.append('Retrieve a bounded subgraph instead of loading the full graph.')
    if args.all_conversations or args.conversation_count > 50 or args.conversation_bytes > 25 * 1024 * 1024:
        suggestions.append('Do not scan historical raw chats by default; process only unextracted or explicitly reopened sessions.')

    print(json.dumps({
        'level': level,
        'score': score,
        'basis': 'workload heuristic only; not a token, credit, or monetary estimate',
        'reasons': reasons,
        'recommended_action': action,
        'optimization_suggestions': suggestions
    }, indent=2))


if __name__ == '__main__':
    main()
