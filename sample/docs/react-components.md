---
title: React Components
---
### Conditional Rendering
Make sure your conditional render checks are booleans.

[Card.tsx lines 15-19](https://github.com/closeio/best-practices-documentation/master/sample/src/Card.tsx#L15-L19)
```tsx
{Boolean(body) && <p>{body}</p>}
```
### Exports
Put all exports, default and named, at the end of the file. This way you can always tell what
is exported by the file by jumping to the bottom.

[Card.tsx lines 24-30](https://github.com/closeio/best-practices-documentation/master/sample/src/Card.tsx#L24-L30)
```tsx
export default Card;
```
### Props
Use interface over type, unless we need something specific that type supports but interface
doesn't.

[Card.tsx lines 0-9](https://github.com/closeio/best-practices-documentation/master/sample/src/Card.tsx#L0-L9)
```tsx
interface CardProps {
  title: string;
  body?: string;
}
```
