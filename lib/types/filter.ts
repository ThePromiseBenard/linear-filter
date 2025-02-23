export interface SubItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterItem {
  value: string;
  label: string;
  labelPlural?: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
}

export type FilterCondition = "is" | "is_not" | "is_any_of";

export interface FilterState {
  selectedItems: string[];
  selectedSubItems: Record<string, string[]>;
  conditions: Record<string, FilterCondition>;
  isSubMenuOpen: boolean;
  currentFilter: string | null;
}

export type FilterAction =
  | { type: "SELECT_ITEM"; payload: string }
  | { type: "SELECT_SUBITEM"; payload: { filter: string; subItem: string } }
  | { type: "REMOVE_FILTER"; payload: { filter: string } }
  | { type: "RESET"; payload?: undefined }
  | {
      type: "TOGGLE_SUBMENU";
      payload: { isOpen: boolean; filter: string | null };
    }
  | {
      type: "SET_CONDITION";
      payload: { filter: string; condition: FilterCondition };
    };

export interface UseFilterProps {
  filters: FilterItem[];
  initialState?: FilterState;
}

export interface FilterProps extends UseFilterProps {
  className?: string;
}
