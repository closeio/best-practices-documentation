// @BestPractice React Components
// @BestPractice.subtitle Props
// @BestPractice.description
//   Use interface over type, unless we need something specific that type supports but interface
//   doesn't.
interface CardProps {
  title: string;
  body?: string;
}
// @BestPractice.end

const Card = ({ title, body }: CardProps) => {
  return (
    <div>
      <h2>{title}</h2>
      {/* @BestPractice React Components */}
      {/* @BestPractice.subtitle Conditional Rendering */}
      {/* @BestPractice.description Make sure your conditional render checks are booleans */}
      {Boolean(body) && <p>{body}</p>}
      {/* @BestPractice.end */}
    </div>
  );
};

// @BestPractice React Components
// @BestPractice.subtitle Exports
// @BestPractice.description
//   Put all exports, default and named, at the end of the file. This way you can always tell what
//   is exported by the file by jumping to the bottom.
export default Card;
// @BestPractice.end
