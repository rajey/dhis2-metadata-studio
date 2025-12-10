import { Query, useDataQuery } from "@dhis2/app-service-data";
import React, { useMemo, useState } from "react";
import {
  MenuItem,
  IconChevronRight16,
  IconChevronDown16,
  colors,
  CircularLoader,
  IconDimensionDataSet16,
} from "@dhis2/ui";

export const MetaDataGroup = (props: {
  label: string;
  query: Query;
  onSelect: (props: { id: string; resource: string }) => void;
}) => {
  const { label, query, onSelect } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { loading, error, data } = useDataQuery(query);

  const groupIcon = useMemo(() => {
    if (loading) {
      return <CircularLoader small />;
    }

    if (isOpen) {
      return <IconChevronDown16 />;
    }
    return <IconChevronRight16 />;
  }, [isOpen, loading]);

  const metaDataItems = useMemo(() => {
    if (loading) {
      return [];
    }

    return data?.results?.[query.results.resource] || [];
  }, [data, loading]);

  return (
    <>
      <MenuItem
        dense
        label={label}
        icon={groupIcon}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />

      {isOpen && (
        <div
          style={{
            marginLeft: 20,
            borderLeftStyle: "solid",
            borderLeftWidth: 1,
            borderLeftColor: colors.grey400,
          }}
        >
          {metaDataItems.map((item: any) => (
            <MenuItem
              key={item.id}
              dense
              icon={<IconDimensionDataSet16 />}
              active={selectedItem === item.id}
              label={item.displayName}
              onClick={() => {
                setSelectedItem(item.id);
                onSelect({ id: item.id, resource: query.results.resource });
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};
