type TreeNode = {
  errors?: string[];
  properties?: Record<string, TreeNode>;
};

export function flattenZodTree(tree: TreeNode, path: string[] = []): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (tree.errors && tree.errors.length) {
    const key = path.join('.') || '_root';
    result[key] = tree.errors;
  }
  if (tree.properties) {
    for (const [key, value] of Object.entries(tree.properties)) {
      Object.assign(result, flattenZodTree(value, [...path, key]));
    }
  }
  return result;
}
