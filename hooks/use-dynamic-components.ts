import dynamic from "next/dynamic";

function getUsedComponents(mdxContent: string) {
  if (!mdxContent) return [];
  const usedComponents: string[] = [];

  // Implement logic to parse MDX content and find custom components
  // This can be a simple string search, regex, or using an MDX parser
  // The result should be an array of strings

  // Example implementation using regex
  const componentRegex = /<([A-Za-z0-9-]+)(\s|\/|>)/g;
  const matches = mdxContent.matchAll(componentRegex);
  for (const match of matches) {
    const componentName = match[1];
    usedComponents.push(componentName);
  }

  return usedComponents;
}

// Function to dynamically import components based on usage
export function useDynamicComponents(
  mdxContent: string,
  componentsList: any[]
) {
  const usedComponents = getUsedComponents(mdxContent);

  const dynamicComponents: Record<string, any> = {};

  if (mdxContent === "[ALL]") {
    componentsList.forEach((component) => {
      const importComponent = () => component.importPath();
      dynamicComponents[component.componentName] = dynamic(importComponent, {
        ssr: false,
      });
    });
    return dynamicComponents;
  }

  usedComponents.forEach((name) => {
    const component = componentsList.find(
      (comp) => comp.componentName === name
    );
    if (component) {
      const importComponent = () => component.importPath();
      dynamicComponents[name] = dynamic(importComponent, { ssr: false });
    }
  });

  return dynamicComponents;
}
