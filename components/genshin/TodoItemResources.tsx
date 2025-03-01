import { memo, useCallback } from "react";

import ItemPopover from "./ItemPopover";

type Props = {
  resources: Record<string, number>;
  originalResources: Record<string, number>;
  updateTodoResourcesById: (newData: any) => void;
  materialInfo: Record<string, any>;
};

function TodoItemResources({
  resources,
  originalResources,
  updateTodoResourcesById,
  materialInfo,
}: Props) {
  // Create a callback for each item's onChange handler
  const handleResourceChange = useCallback(
    (id: string, data: number) => {
      updateTodoResourcesById({ id, value: data });
    },
    [updateTodoResourcesById],
  );

  return (
    <div className="mb-4 flex flex-wrap justify-center gap-1.5">
      {Object.entries(resources).map(([id, data]) => (
        <ItemPopover
          key={id}
          id={id}
          data={data}
          originalData={originalResources[id]}
          handleOnChange={(newValues) =>
            handleResourceChange(newValues.id, newValues.value)
          }
          materialInfo={materialInfo[id]}
        />
      ))}
    </div>
  );
}

export default memo(TodoItemResources);
