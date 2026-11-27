"""Check periodic words directly in the infinite graph. Python 3, standard library."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent


def read_word(name):
    return [int(value) for value in (ROOT / name).read_text(encoding="ascii").split()]


def check_period(word, palette, allow_vacancies=False):
    if not word or any(c < int(not allow_vacancies) or c > palette for c in word):
        raise ValueError("Invalid palette or empty word")
    ball = {0}
    comparisons = 0
    for color in range(1, palette + 1):
        ball = ball | {x + s for x in ball for s in (-10, -7, 7, 10)}
        offsets = sorted(d for d in ball if d > 0)
        for i, value in enumerate(word):
            if value == color:
                for d in offsets:
                    comparisons += 1
                    if word[(i + d) % len(word)] == color:
                        raise ValueError(f"Conflict: residue {i}, displacement {d}, color {color}")
    return comparisons


if __name__ == "__main__":
    complete = read_word("coloring.txt")
    count = check_period(complete, max(complete))
    print(f"Upper bound {max(complete)}, period {len(complete)}, {count} legal comparisons.")
    partial = read_word("density-124.txt")
    if set(partial) != {0, 1, 2, 4} or len(partial) != 102 or sum(c > 0 for c in partial) != 67:
        raise ValueError("Incorrect density witness")
    check_period(partial, 4, allow_vacancies=True)
    print("Colors 1, 2, 4 attain joint density 67/102.")

