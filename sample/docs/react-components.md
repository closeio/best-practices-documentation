---
title: React Components
---
### Conditional Rendering
Make sure your conditional render checks are booleans.

[Card.tsx lines 16-20](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L16-L20)
```tsx
{Boolean(body) && <p>{body}</p>}
```
### Exports
Put all exports, default and named, at the end of the file. This way you can always tell what
is exported by the file by jumping to the bottom.

[Card.tsx lines 25-31](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L25-L31)
```tsx
export default Card;
```
### Props
Use interface over type, unless we need something specific that type supports but interface
doesn't.

[Card.tsx lines 1-10](https://github.com/closeio/best-practices-documentation/tree/main/sample/src/Card.tsx#L1-L10)
```tsx
interface CardProps {
  title: string;
  body?: string;
}
```
