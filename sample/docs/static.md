## This is static documentation

Here we give some long form documentation!

And then we want to insert a code sample:

<!-- @BestPractice conditional_rendering_sample -->
[Card.tsx lines 16-21](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L16-L21)
```tsx
{Boolean(body) && <p>{body}</p>}
```
<!-- @BestPractice.end -->

And then we're going to add some more info after the code sample, that will not
be impacted by replacing the docs.

