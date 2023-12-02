import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DropResult } from "react-beautiful-dnd";
import { Dispatch, SetStateAction, cloneElement } from "react";

type Props = {
  items: string[];
  setItems: Dispatch<SetStateAction<string[]>>;
  children?: React.ReactElement;
};

const DnDList: React.FC<Props> = ({ items, setItems, children }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  //pass props to children
  // return React.cloneElement(children, { items, setItems });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="items" direction="horizontal" type="items">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex w-full flex-row justify-start"
          >
            {items.map((item, index) => (
              <Draggable key={item} draggableId={item} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {children && cloneElement(children, { item })}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default DnDList;
