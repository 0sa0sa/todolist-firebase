import { FieldValue } from "firebase/firestore";

export type Todo = {
  id: number;
  title: string;
  checked: boolean;
  isSoftDeleted: boolean;
  createdAt: FieldValue | null;
  softDeletedAt: FieldValue | null;
};

export const blankTodo: Todo = {
  id: 0,
  title: "",
  checked: false,
  isSoftDeleted: false,
  createdAt: null,
  softDeletedAt: null,
};
