import { useReducer, useState, useEffect } from "react";
import type {
  FilterState,
  FilterAction,
  UseFilterProps,
  FilterItem,
} from "@/lib/types/filter";

const defaultInitialState: FilterState = {
  selectedItems: [],
  selectedSubItems: {},
  conditions: {},
  isSubMenuOpen: false,
  currentFilter: null,
};

function filterReducer(
  state: FilterState,
  action: FilterAction,
  filters: FilterItem[]
): FilterState {
  switch (action.type) {
    case "SELECT_ITEM":
      if (state.selectedItems.includes(action.payload)) {
        return {
          ...state,
          isSubMenuOpen: !!filters.find((f) => f.value === action.payload)
            ?.subItems,
          currentFilter: action.payload,
        };
      }
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.payload],
        isSubMenuOpen: !!filters.find((f) => f.value === action.payload)
          ?.subItems,
        currentFilter: action.payload,
      };
    case "SELECT_SUBITEM": {
      const currentSubItems =
        state.selectedSubItems[action.payload.filter] || [];
      let newSubItems: string[];

      if (currentSubItems.includes(action.payload.subItem)) {
        // Remove the subitem
        newSubItems = currentSubItems.filter(
          (item) => item !== action.payload.subItem
        );
      } else {
        // Add the subitem
        newSubItems = [...currentSubItems, action.payload.subItem];
      }

      // Update condition based on number of selected subitems
      let condition = state.conditions[action.payload.filter] || "is";
      if (newSubItems.length === 1) {
        condition = "is";
      } else if (newSubItems.length > 1) {
        condition = "is_any_of";
      }

      if (newSubItems.length === 0) {
        const otherFiltersHaveSubitems = Object.entries(state.selectedSubItems)
          .filter(([key]) => key !== action.payload.filter)
          .some(([, items]) => items.length > 0);

        if (!otherFiltersHaveSubitems) {
          return defaultInitialState;
        }
      }

      return {
        ...state,
        selectedSubItems: {
          ...state.selectedSubItems,
          [action.payload.filter]: newSubItems,
        },
        conditions: {
          ...state.conditions,
          [action.payload.filter]: condition,
        },
      };
    }
    case "REMOVE_FILTER":
      const { filter } = action.payload;
      const newSelectedItems = state.selectedItems.filter(
        (item) => item !== filter
      );
      const newSelectedSubItems = { ...state.selectedSubItems };
      delete newSelectedSubItems[filter];

      return {
        ...state,
        selectedItems: newSelectedItems,
        selectedSubItems: newSelectedSubItems,
      };
    case "RESET":
      return defaultInitialState;
    case "TOGGLE_SUBMENU":
      return {
        ...state,
        isSubMenuOpen: action.payload.isOpen,
        currentFilter: action.payload.filter,
      };
    case "SET_CONDITION":
      return {
        ...state,
        conditions: {
          ...state.conditions,
          [action.payload.filter]: action.payload.condition,
        },
      };
    default:
      return state;
  }
}

export function useFilter({
  filters,
  initialState = defaultInitialState,
}: UseFilterProps) {
  const [state, dispatch] = useReducer(
    (state: FilterState, action: FilterAction) =>
      filterReducer(state, action, filters),
    initialState
  );
  const [mainOpen, setMainOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [subItemOpen, setSubItemOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (state === defaultInitialState) {
      setMainOpen(false);
      setFilterOpen(false);
      setSubItemOpen(false);
      setActiveFilter(null);
    }
  }, [state]);

  const handlePopoverChange = (
    type: "main" | "filter" | "subitem",
    filter: string | null = null,
    isOpen: boolean
  ) => {
    if (type !== "main") setMainOpen(false);
    if (type !== "filter") setFilterOpen(false);
    if (type !== "subitem") setSubItemOpen(false);

    setActiveFilter(filter);

    switch (type) {
      case "main":
        setMainOpen(isOpen);
        if (isOpen) {
          dispatch({
            type: "TOGGLE_SUBMENU",
            payload: { isOpen: false, filter: null },
          });
        }
        break;
      case "filter":
        setFilterOpen(isOpen);
        if (isOpen) {
          dispatch({
            type: "TOGGLE_SUBMENU",
            payload: { isOpen: false, filter: null },
          });
        }
        break;
      case "subitem":
        setSubItemOpen(isOpen);
        if (isOpen && filter) {
          dispatch({
            type: "TOGGLE_SUBMENU",
            payload: { isOpen: true, filter },
          });
        }
        break;
    }
  };

  return {
    state,
    dispatch,
    mainOpen,
    filterOpen,
    subItemOpen,
    activeFilter,
    handlePopoverChange,
  };
}
