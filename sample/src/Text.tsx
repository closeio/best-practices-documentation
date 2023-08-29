// @BestPractice React Components
// @BestPractice.subtitle Child Props
// @BestPractice.id childSpecificity
// @BestPractice.description
//   If you have a component that should only accept a specific type of child, give that type
//   rather than using the more generic `ReactNode`.
interface TextProps {
  children: string;
}
// @BestPractice.end

const Text = ({ children }: TextProps) => <p>{children}</p>;

export default Text;
