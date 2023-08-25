type CheckArgs = {
    srcPath: string;
    destPath: string;
};
/**
 * Compare the digest of the best practices against the stored digest to
 * see if the docs need to be updated.
 */
declare const checkAction: ({ srcPath, destPath }: CheckArgs) => Promise<void>;
export default checkAction;
//# sourceMappingURL=check.d.ts.map