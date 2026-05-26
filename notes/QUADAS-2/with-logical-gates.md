[[QUADAS-2]] uses logical operators where $Q_i$ means signaling question $i$ is "Yes" (true), and $\neg Q_i$ means "No" (false); "Unclear" defaults to unclear judgment.

## Notation Guide

- $Q1, Q2, \dots$: Boolean variables for signaling questions (Yes = true, No = false).
- $\land$: Logical AND—all must be true for result true.
- $\lor$: Logical OR—at least one true for result true.
- $\neg$: Logical NOT—inverts true to false (Yes to No).
- $\geq$: Greater than or equal—counts "No" answers.


## Domain Logic

### Patient Selection

```
Low: Q1 ∧ Q2 ∧ Q3
High: ¬Q1 ∨ ¬Q2 ∨ ¬Q3
Unclear: else
```

All three Yes for low risk; any No for high.

### Index Test

```
Low: Q1 ∧ Q2
High: ¬Q1 ∨ ¬Q2
Unclear: else
```

Both Yes for low; any No for high.

### Reference Standard

```
Low: Q1 ∧ Q2
High: ¬Q1 ∨ ¬Q2
Unclear: else
```

Both Yes for low; any No for high.

### Flow and Timing

```
Low: Q1 ∧ Q2 ∧ Q3 ∧ Q4
High: count(¬Qi) ≥ 2
Unclear: else
```

All four Yes for low; two or more No for high.

### Applicability (All Domains)

```
High: mismatch with review question
Low: no mismatch
```

Binary check—no operators needed.
