"use client";

import { useMemo } from "react";
import { ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilter } from "@/lib/hooks/useFilter";
import type {
  FilterProps,
  FilterItem,
  FilterCondition,
} from "@/lib/types/filter";

const getSubItemsDisplay = (framework: FilterItem, subItems: string[]) => {
  if (subItems.length === 0) return "";
  if (subItems.length === 1) {
    const subItem = framework.subItems?.find((si) => si.value === subItems[0]);
    return subItem?.label || "";
  }
  return `${subItems.length} ${
    framework.labelPlural || framework.label.toLowerCase() + "s"
  }`;
};

const CONDITIONS: { value: FilterCondition; label: string }[] = [
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "is_any_of", label: "is any of" },
];

export function FilterBox({ filters, className, initialState }: FilterProps) {
  const {
    state,
    dispatch,
    mainOpen,
    filterOpen,
    subItemOpen,
    activeFilter,
    handlePopoverChange,
  } = useFilter({ filters, initialState });

  const selectedItemsWithSubItems = state.selectedItems.filter(
    (itemValue) => state.selectedSubItems[itemValue]
  );

  const CommandMenu = useMemo(() => {
    function CommandMenuContent() {
      return (
        <Command className="rounded-lg border shadow-md">
          <CommandList>
            <CommandEmpty className="text-sm text-muted-foreground">
              No filter found.
            </CommandEmpty>
            <CommandGroup>
              {state.isSubMenuOpen
                ? filters
                    .find((f) => f.value === state.currentFilter)
                    ?.subItems?.map((subItem) => (
                      <CommandItem
                        key={subItem.value}
                        value={subItem.value}
                        onSelect={(currentValue) => {
                          dispatch({
                            type: "SELECT_SUBITEM",
                            payload: {
                              filter: state.currentFilter!,
                              subItem: currentValue,
                            },
                          });
                        }}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-center w-4 h-4 rounded border border-input ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <Checkbox
                            checked={state.selectedSubItems[
                              state.currentFilter!
                            ]?.includes(subItem.value)}
                            className=" border-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        </div>
                        {subItem.icon && (
                          <span className="text-muted-foreground">
                            {subItem.icon}
                          </span>
                        )}
                        <span>{subItem.label}</span>
                      </CommandItem>
                    ))
                : filters.map((filter) => (
                    <CommandItem
                      key={filter.value}
                      value={filter.value}
                      onSelect={(currentValue) => {
                        dispatch({
                          type: "SELECT_ITEM",
                          payload: currentValue,
                        });
                        if (!filter.subItems) {
                          handlePopoverChange("main", null, false);
                        }
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm"
                    >
                      {filter.icon && (
                        <span className="text-muted-foreground">
                          {filter.icon}
                        </span>
                      )}
                      {filter.label}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      );
    }
    return CommandMenuContent;
  }, [
    state.isSubMenuOpen,
    state.currentFilter,
    state.selectedSubItems,
    filters,
    handlePopoverChange,
    dispatch,
  ]);

  return (
    <div
      className={cn(
        "py-2 px-3 rounded-lg border bg-background/50 backdrop-blur-sm flex items-center gap-2 flex-wrap shadow-sm",
        className
      )}
    >
      {selectedItemsWithSubItems.map((itemValue) => {
        const filter = filters.find((f) => f.value === itemValue);
        const subItems = state.selectedSubItems[itemValue] || [];
        const condition = state.conditions[itemValue] || "is";

        if (subItems.length === 0) return null;

        // Get available conditions based on number of selected subitems
        const availableConditions =
          subItems.length === 1
            ? CONDITIONS.filter((c) => c.value !== "is_any_of")
            : CONDITIONS;

        return (
          <div
            key={itemValue}
            className="flex items-center gap-2 pl-2 first:pl-0"
          >
            <Popover
              open={filterOpen && activeFilter === itemValue}
              onOpenChange={(isOpen) =>
                handlePopoverChange("filter", itemValue, isOpen)
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 h-7 text-sm font-medium bg-muted/30 hover:bg-muted/50 transition-colors rounded-md"
                >
                  {filter?.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" sideOffset={8}>
                <CommandMenu />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 h-7 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-md"
                >
                  {CONDITIONS.find((c) => c.value === condition)?.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" sideOffset={8}>
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {availableConditions.map((conditionOption) => (
                        <CommandItem
                          key={conditionOption.value}
                          onSelect={() => {
                            dispatch({
                              type: "SET_CONDITION",
                              payload: {
                                filter: itemValue,
                                condition: conditionOption.value,
                              },
                            });
                          }}
                          className="text-sm"
                        >
                          {conditionOption.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover
              open={subItemOpen && activeFilter === itemValue}
              onOpenChange={(isOpen) =>
                handlePopoverChange("subitem", itemValue, isOpen)
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-2 h-7 text-sm font-normal",
                    "bg-primary/5 hover:bg-primary/10",
                    "border border-primary/20",
                    "text-primary hover:text-primary",
                    "transition-colors rounded-md"
                  )}
                >
                  {getSubItemsDisplay(filter!, subItems)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" sideOffset={8}>
                <CommandMenu />
              </PopoverContent>
            </Popover>

            <X
              onClick={() =>
                dispatch({
                  type: "REMOVE_FILTER",
                  payload: { filter: itemValue },
                })
              }
              className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            />
          </div>
        );
      })}

      <Popover
        open={mainOpen}
        onOpenChange={(isOpen) => handlePopoverChange("main", null, isOpen)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={mainOpen}
            className="h-7 px-2 text-sm font-normal justify-start hover:bg-muted/50 transition-colors"
          >
            <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
            {selectedItemsWithSubItems.length === 0 && (
              <span className="ml-1 text-muted-foreground">Filter</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" sideOffset={8}>
          <CommandMenu />
        </PopoverContent>
      </Popover>
    </div>
  );
}
