# The packing chromatic number of D(7,10)

**Result.** For the integer distance graph $D(7,10)$, in which integers are adjacent when they differ by 7 or 10:

$$21 \le \chi_\rho(D(7,10)) \le 29.$$

The previously published bounds were $12 \le \chi_\rho \le 40$ (Ekstein, Holub, Togni, *Discrete Appl. Math.* 167 (2014), Table 1).

The paper is [`paper/paper.tex`](paper/paper.tex). This README gives an outline.

## Outline

**Upper bound 29.** [`certificates/coloring.txt`](certificates/coloring.txt) is a word of length 1088 over colours 1–29. Colouring $x \in \mathbb Z$ with $w[x \bmod 1088]$ gives a packing colouring. To check this, let $B_c$ be the set of integers within graph distance $c$ of 0. For every position of colour $c$ and every positive $d \in B_c$, the position $d$ steps ahead must have a different colour.

**Lower bound 21.** This is a density argument with finite-state integer potentials. Read a colouring left to right, and let one automaton per colour track which positions ahead are blocked. Suppose an integer potential $H$ satisfies $q\,w(s,t) - p \le H(s) - H(t)$ on every transition, where $w=1$ if the step places a colour and $w=0$ otherwise. Then every interval $I$ contains at most $\frac{p}{q}|I| + \frac{H(s_0)}{q}$ coloured positions.

| colours | max share of any long interval | certificate |
|---|---|---|
| {1, 2, 4} jointly | **67/102**, which is attained | 24,274,996-state potential, $H(s_0)=569$ |
| 3 | 2/17 | $H(s_0)=45$ |
| 5 | 2/45 | $H(s_0)=84$ |
| 6 | 2/55 | $H(s_0)=104$ |
| 7 | 1/34 | $H(s_0)=62$ |
| c = 8…20 | 1/(10c−14) | $\{1,\dots,10c-15\}\subseteq B_c$ |

These shares sum to $\frac{128279378457743209}{128437412456857504} < 1$, so 20 colours cannot cover $\mathbb Z$.

The joint bound is essential. Taken separately, colours 1, 2 and 4 have maximum densities $8/17 + 7/37 + 3/41 \approx 0.733$, and with that value the total would exceed 1.

## Verify it yourself

Requires Python 3 and Node.js 18+. Only the standard library is used.

```sh
cd certificates
python3 verify_upper.py     # checks the colouring of period 1088 and the 67/102 witness
node verify_lower.cjs       # checks every potential inequality and the final sum (~1 s)
```

The second, separately written implementation in [`independent-check/`](independent-check) does not use the supplied potential:

```sh
cd independent-check
python3 check_periodic.py ../certificates/coloring.txt ../certificates/density-124.txt  # BFS distances
python3 single_max_density.py 1 2 3 4 5 6 7   # exact single-colour densities (Karp)
python3 single_potentials.py                  # potentials for colours 3,5,6,7
python3 dump_automata.py                      # writes t1/t2/t4.txt
node --max-old-space-size=4000 joint_124.cjs 67 102 200   # recomputes the {1,2,4} potential (~45 s)
```

It reproduces the same state count, transition count and $H(s_0)=569$.

## Credits

**Authors:** Ren Ellis, ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google)

- **Ren Ellis** initiated and directed the project and checked the results. As the human author, Ren Ellis is the corresponding author and takes responsibility for the content.
- **ChatGPT / Codex** did the computational search and produced the colouring, the certificates and the verifiers in `certificates/`.
- **Claude** wrote the independent re-verification in `independent-check/` and prepared the manuscript.
- **Gemini** wrote the prompts that directed ChatGPT/Codex's search.

## 中文摘要

本仓库证明整数距离图 $D(7,10)$ 的填充着色数满足 $21\le\chi_\rho\le29$。原文献给出的区间是 12–40。上界来自一个周期为 1088 的显式着色。下界是密度论证：用整数势函数证书证明颜色 1、2、4 合计最多占 67/102，并且这个值可以达到；其余颜色逐个给界，各项合计小于 1。所有证书都能用标准库程序复核，另有一套独立实现重算全部数值。

## License

The text and data are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), and the code under the MIT License. See [`LICENSE`](LICENSE).
