---
title: React Components
---
### Conditional Rendering
Make sure your conditional render checks are booleans.

```tsx
{Boolean(body) && <p>{body}</p>}
```
From [Card.tsx lines 16-21](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L16-L21)
### Exports
Put all exports, default and named, at the end of the file. This way you can always tell what
is exported by the file by jumping to the bottom.

```tsx
export default Card;
```
From [Card.tsx lines 26-32](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L26-L32)
### Props
Use interface over type, unless we need something specific that type supports but interface
doesn't.

```tsx
interface CardProps {
  title: string;
  body?: string;
}
```
From [Card.tsx lines 1-10](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L1-L10)
