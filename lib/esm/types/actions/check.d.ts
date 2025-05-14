type CheckArgs = {
    srcPath: string[];
    generatedPath: string;
};
/**
 * Compare the digest of the best practices against the stored digest to
 * see if the docs need to be updated.
 */
declare const checkAction: ({ srcPath: srcPaths, generatedPath }: CheckArgs) => Promise<void>;
export default checkAction;
//# sourceMappingURL=check.d.ts.map