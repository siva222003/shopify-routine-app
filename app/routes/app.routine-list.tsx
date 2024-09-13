// import { TitleBar } from "@shopify/app-bridge-react";
// import {
//   IndexTable,
//   Card,
//   useIndexResourceState,
//   Text,
//   Badge,
//   Page,
// } from "@shopify/polaris";
// import prisma from "../db.server";
// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";

// export async function loader() {
//   const data = await prisma.routine.findMany();

//   return json({
//     success: "true",
//     data,
//   });
// }

// export default function SimpleIndexTableExample() {
//   const routines = useLoaderData<typeof loader>();

//   const orders = [
//     {
//       id: "1020",
//       order: "#1020",
//       date: "Jul 20 at 4:34pm",
//       customer: "Jaydon Stanton",
//       total: "$969.44",
//       paymentStatus: <Badge progress="complete">Paid</Badge>,
//       fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
//     },
//     {
//       id: "1019",
//       order: "#1019",
//       date: "Jul 20 at 3:46pm",
//       customer: "Ruben Westerfelt",
//       total: "$701.19",
//       paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
//       fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
//     },
//     {
//       id: "1018",
//       order: "#1018",
//       date: "Jul 20 at 3.44pm",
//       customer: "Leo Carder",
//       total: "$798.24",
//       paymentStatus: <Badge progress="complete">Paid</Badge>,
//       fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
//     },
//   ];
//   const resourceName = {
//     singular: "order",
//     plural: "orders",
//   };

//   const { selectedResources, allResourcesSelected, handleSelectionChange } =
//     useIndexResourceState(orders);

//   const rowMarkup = routines.data.map(
//     ({ id, category, product, status, type }, index) => (
//       <IndexTable.Row
//         id={`${id}`}
//         key={id}
//         selected={selectedResources.includes(`${id}`)}
//         position={index}
//       >
//         <IndexTable.Cell>
//           <Text variant="bodyMd" fontWeight="bold" as="span">
//             {id}
//           </Text>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{category}</IndexTable.Cell>
//         <IndexTable.Cell>{type}</IndexTable.Cell>
//         <IndexTable.Cell>{product}</IndexTable.Cell>

//         <IndexTable.Cell>
//           <Badge>{status}</Badge>
//         </IndexTable.Cell>
//       </IndexTable.Row>
//     ),
//   );

//   return (
//     <Page>
//       <TitleBar title="Routine List" />
//       <Card>
//         <IndexTable
//           resourceName={resourceName}
//           itemCount={orders.length}
//           selectedItemsCount={
//             allResourcesSelected ? "All" : selectedResources.length
//           }
//           onSelectionChange={handleSelectionChange}
//           headings={[
//             { title: "Id" },
//             { title: "Category" },
//             { title: "Type" },
//             { title: "Product" },
//             { title: "Status" },
//           ]}
//         >
//           {rowMarkup}
//         </IndexTable>
//       </Card>
//     </Page>
//   );
// }

import { useNavigate } from "@remix-run/react";
import {
  TextField,
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  useBreakpoints,
  Page,
} from "@shopify/polaris";
import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import { useState, useCallback } from "react";

// export default function IndexTableWithViewsSearchFilterSorting() {
//   const sleep = (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));
//   const [itemStrings, setItemStrings] = useState([
//     "All",
//     "Unpaid",
//     "Open",
//     "Closed",
//     "Local delivery",
//     "Local pickup",
//   ]);
//   const deleteView = (index: number) => {
//     const newItemStrings = [...itemStrings];
//     newItemStrings.splice(index, 1);
//     setItemStrings(newItemStrings);
//     setSelected(0);
//   };

//   const duplicateView = async (name: string) => {
//     setItemStrings([...itemStrings, name]);
//     setSelected(itemStrings.length);
//     await sleep(1);
//     return true;
//   };

//   const tabs: TabProps[] = itemStrings.map((item, index) => ({
//     content: item,
//     index,
//     onAction: () => {},
//     id: `${item}-${index}`,
//     isLocked: index === 0,
//     actions:
//       index === 0
//         ? []
//         : [
//             {
//               type: "rename",
//               onAction: () => {},
//               onPrimaryAction: async (value: string): Promise<boolean> => {
//                 const newItemsStrings = tabs.map((item, idx) => {
//                   if (idx === index) {
//                     return value;
//                   }
//                   return item.content;
//                 });
//                 await sleep(1);
//                 setItemStrings(newItemsStrings);
//                 return true;
//               },
//             },
//             {
//               type: "duplicate",
//               onPrimaryAction: async (value: string): Promise<boolean> => {
//                 await sleep(1);
//                 duplicateView(value);
//                 return true;
//               },
//             },
//             {
//               type: "edit",
//             },
//             {
//               type: "delete",
//               onPrimaryAction: async () => {
//                 await sleep(1);
//                 deleteView(index);
//                 return true;
//               },
//             },
//           ],
//   }));

//   const [selected, setSelected] = useState(0);

//   const onCreateNewView = async (value: string) => {
//     await sleep(1000);
//     setItemStrings([...itemStrings, value]);
//     setSelected(itemStrings.length);
//     return true;
//   };

//   const sortOptions: IndexFiltersProps["sortOptions"] = [
//     { label: "Order", value: "order asc", directionLabel: "Ascending" },
//     { label: "Order", value: "order desc", directionLabel: "Descending" },
//     { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
//     { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
//     { label: "Date", value: "date asc", directionLabel: "A-Z" },
//     { label: "Date", value: "date desc", directionLabel: "Z-A" },
//     { label: "Total", value: "total asc", directionLabel: "Ascending" },
//     { label: "Total", value: "total desc", directionLabel: "Descending" },
//   ];

//   const [sortSelected, setSortSelected] = useState(["order asc"]);
//   const { mode, setMode } = useSetIndexFiltersMode();
//   const onHandleCancel = () => {};

//   const onHandleSave = async () => {
//     await sleep(1);
//     return true;
//   };

//   const primaryAction: IndexFiltersProps["primaryAction"] =
//     selected === 0
//       ? {
//           type: "save-as",
//           onAction: onCreateNewView,
//           disabled: false,
//           loading: false,
//         }
//       : {
//           type: "save",
//           onAction: onHandleSave,
//           disabled: false,
//           loading: false,
//         };
//   const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
//     undefined,
//   );
//   const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
//     undefined,
//   );
//   const [taggedWith, setTaggedWith] = useState("");
//   const [queryValue, setQueryValue] = useState("");

//   const handleAccountStatusChange = useCallback(
//     (value: string[]) => setAccountStatus(value),
//     [],
//   );
//   const handleMoneySpentChange = useCallback(
//     (value: [number, number]) => setMoneySpent(value),
//     [],
//   );
//   const handleTaggedWithChange = useCallback(
//     (value: string) => setTaggedWith(value),
//     [],
//   );
//   const handleFiltersQueryChange = useCallback(
//     (value: string) => setQueryValue(value),
//     [],
//   );
//   const handleAccountStatusRemove = useCallback(
//     () => setAccountStatus(undefined),
//     [],
//   );
//   const handleMoneySpentRemove = useCallback(
//     () => setMoneySpent(undefined),
//     [],
//   );
//   const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
//   const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
//   const handleFiltersClearAll = useCallback(() => {
//     handleAccountStatusRemove();
//     handleMoneySpentRemove();
//     handleTaggedWithRemove();
//     handleQueryValueRemove();
//   }, [
//     handleAccountStatusRemove,
//     handleMoneySpentRemove,
//     handleQueryValueRemove,
//     handleTaggedWithRemove,
//   ]);

//   const filters = [
//     {
//       key: "accountStatus",
//       label: "Account status",
//       filter: (
//         <ChoiceList
//           title="Account status"
//           titleHidden
//           choices={[
//             { label: "Enabled", value: "enabled" },
//             { label: "Not invited", value: "not invited" },
//             { label: "Invited", value: "invited" },
//             { label: "Declined", value: "declined" },
//           ]}
//           selected={accountStatus || []}
//           onChange={handleAccountStatusChange}
//           allowMultiple
//         />
//       ),
//       shortcut: true,
//     },
//     {
//       key: "taggedWith",
//       label: "Tagged with",
//       filter: (
//         <TextField
//           label="Tagged with"
//           value={taggedWith}
//           onChange={handleTaggedWithChange}
//           autoComplete="off"
//           labelHidden
//         />
//       ),
//       shortcut: true,
//     },
//     {
//       key: "moneySpent",
//       label: "Money spent",
//       filter: (
//         <RangeSlider
//           label="Money spent is between"
//           labelHidden
//           value={moneySpent || [0, 500]}
//           prefix="$"
//           output
//           min={0}
//           max={2000}
//           step={1}
//           onChange={handleMoneySpentChange}
//         />
//       ),
//     },
//   ];

//   const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
//   if (accountStatus && !isEmpty(accountStatus)) {
//     const key = "accountStatus";
//     appliedFilters.push({
//       key,
//       label: disambiguateLabel(key, accountStatus),
//       onRemove: handleAccountStatusRemove,
//     });
//   }
//   if (moneySpent) {
//     const key = "moneySpent";
//     appliedFilters.push({
//       key,
//       label: disambiguateLabel(key, moneySpent),
//       onRemove: handleMoneySpentRemove,
//     });
//   }
//   if (!isEmpty(taggedWith)) {
//     const key = "taggedWith";
//     appliedFilters.push({
//       key,
//       label: disambiguateLabel(key, taggedWith),
//       onRemove: handleTaggedWithRemove,
//     });
//   }

//   const orders = [
//     {
//       id: "1020",
//       order: (
//         <Text as="span" variant="bodyMd" fontWeight="semibold">
//           #1020
//         </Text>
//       ),
//       date: "Jul 20 at 4:34pm",
//       customer: "Jaydon Stanton",
//       total: "$969.44",
//       paymentStatus: <Badge progress="complete">Paid</Badge>,
//       fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
//     },
//     {
//       id: "1019",
//       order: (
//         <Text as="span" variant="bodyMd" fontWeight="semibold">
//           #1019
//         </Text>
//       ),
//       date: "Jul 20 at 3:46pm",
//       customer: "Ruben Westerfelt",
//       total: "$701.19",
//       paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
//       fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
//     },
//     {
//       id: "1018",
//       order: (
//         <Text as="span" variant="bodyMd" fontWeight="semibold">
//           #1018
//         </Text>
//       ),
//       date: "Jul 20 at 3.44pm",
//       customer: "Leo Carder",
//       total: "$798.24",
//       paymentStatus: <Badge progress="complete">Paid</Badge>,
//       fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
//     },
//   ];
//   const resourceName = {
//     singular: "order",
//     plural: "orders",
//   };

//   const { selectedResources, allResourcesSelected, handleSelectionChange } =
//     useIndexResourceState(orders);

//   const rowMarkup = orders.map(
//     (
//       { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
//       index,
//     ) => (
//       <IndexTable.Row
//         id={id}
//         key={id}
//         selected={selectedResources.includes(id)}
//         position={index}
//       >
//         <IndexTable.Cell>
//           <Text variant="bodyMd" fontWeight="bold" as="span">
//             {order}
//           </Text>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{date}</IndexTable.Cell>
//         <IndexTable.Cell>{customer}</IndexTable.Cell>
//         <IndexTable.Cell>
//           <Text as="span" alignment="end" numeric>
//             {total}
//           </Text>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
//         <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
//       </IndexTable.Row>
//     ),
//   );

//   return (
//     <Card>
//       <IndexFilters
//         sortOptions={sortOptions}
//         sortSelected={sortSelected}
//         queryValue={queryValue}
//         queryPlaceholder="Searching in all"
//         onQueryChange={handleFiltersQueryChange}
//         onQueryClear={() => setQueryValue("")}
//         onSort={setSortSelected}
//         primaryAction={primaryAction}
//         cancelAction={{
//           onAction: onHandleCancel,
//           disabled: false,
//           loading: false,
//         }}
//         tabs={tabs}
//         selected={selected}
//         onSelect={setSelected}
//         canCreateNewView
//         onCreateNewView={onCreateNewView}
//         filters={filters}
//         appliedFilters={appliedFilters}
//         onClearAll={handleFiltersClearAll}
//         mode={mode}
//         setMode={setMode}
//       />
//       <IndexTable
//         condensed={useBreakpoints().smDown}
//         resourceName={resourceName}
//         itemCount={orders.length}
//         selectedItemsCount={
//           allResourcesSelected ? "All" : selectedResources.length
//         }
//         onSelectionChange={handleSelectionChange}
//         headings={[
//           { title: "Order" },
//           { title: "Date" },
//           { title: "Customer" },
//           { title: "Total", alignment: "end" },
//           { title: "Payment status" },
//           { title: "Fulfillment status" },
//         ]}
//       >
//         {rowMarkup}
//       </IndexTable>
//     </Card>
//   );

//   function disambiguateLabel(key: string, value: string | any[]): string {
//     switch (key) {
//       case "moneySpent":
//         return `Money spent is between $${value[0]} and $${value[1]}`;
//       case "taggedWith":
//         return `Tagged with ${value}`;
//       case "accountStatus":
//         return (value as string[]).map((val) => `Customer ${val}`).join(", ");
//       default:
//         return value as string;
//     }
//   }

//   function isEmpty(value: string | string[]): boolean {
//     if (Array.isArray(value)) {
//       return value.length === 0;
//     } else {
//       return value === "" || value == null;
//     }
//   }
// }

// This example is for guidance purposes. Copying it will come with caveats.

export default function IndexFiltersDefault() {
  const navigate = useNavigate();

  function disambiguateLabel(key: string, value: any[]): any[] | string {
    switch (key) {
      case "type":
        return value.map((val) => `type: ${val}`).join(", ");
      case "tone":
        return value.map((val) => `tone: ${val}`).join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [itemStrings, setItemStrings] = useState([
    "All",
    "Active",
    "Draft",
    "Archived",
  ]);

  const deleteView = (index: number) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name: string) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (name) => {
                await sleep(1);
                duplicateView(name);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const [selected, setSelected] = useState(0);

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  const sortOptions = [
    { label: "Product", value: "product asc", directionLabel: "Ascending" },
    { label: "Product", value: "product desc", directionLabel: "Descending" },
    { label: "Status", value: "tone asc", directionLabel: "A-Z" },
    { label: "Status", value: "tone desc", directionLabel: "Z-A" },
    { label: "Type", value: "type asc", directionLabel: "A-Z" },
    { label: "Type", value: "type desc", directionLabel: "Z-A" },
    { label: "Vendor", value: "vendor asc", directionLabel: "Ascending" },
    { label: "Vendor", value: "vendor desc", directionLabel: "Descending" },
  ];

  const [sortSelected, setSortSelected] = useState(["product asc"]);

  const { mode, setMode } = useSetIndexFiltersMode();

  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };

  const [tone, setStatus] = useState(undefined);

  const [type, setType] = useState(undefined);

  const [queryValue, setQueryValue] = useState("");

  const handleStatusChange = useCallback((value) => setStatus(value), []);

  const handleTypeChange = useCallback((value) => setType(value), []);

  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );

  const handleStatusRemove = useCallback(() => setStatus(undefined), []);

  const handleTypeRemove = useCallback(() => setType(undefined), []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  const handleFiltersClearAll = useCallback(() => {
    handleStatusRemove();
    handleTypeRemove();
    handleQueryValueRemove();
  }, [handleStatusRemove, handleQueryValueRemove, handleTypeRemove]);

  const filters = [
    {
      key: "tone",
      label: "Status",
      filter: (
        <ChoiceList
          title="tone"
          titleHidden
          choices={[
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          selected={tone || []}
          onChange={handleStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "type",
      label: "Type",
      filter: (
        <ChoiceList
          title="Type"
          titleHidden
          choices={[
            { label: "Brew Gear", value: "brew-gear" },
            { label: "Brew Merch", value: "brew-merch" },
          ]}
          selected={type || []}
          onChange={handleTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];

  if (tone && !isEmpty(tone)) {
    const key = "tone";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, tone),
      onRemove: handleStatusRemove,
    });
  }
  if (type && !isEmpty(type)) {
    const key = "type";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, type),
      onRemove: handleTypeRemove,
    });
  }
  const products = [
    {
      id: "1020",
      price: "$200",
      product: "1ZPRESSO | J-MAX Manual Coffee Grinder",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "20 in stock",
      type: "Brew Gear",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1018",
      price: "$200",
      product: "Acaia Pearl Set",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "2 in stock for 50 variants",
      type: "Brew Gear",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1016",
      price: "$200",
      product: "AeroPress Go Brewer",
      tone: <Badge tone="info">Draft</Badge>,
      inventory: "3 in stock for 50 variants",
      type: "Brew Gear",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1015",
      price: "$200",
      product: "Canadiano Brewer",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "890 in stock for 50 variants",
      type: "Brew Merch",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1014",
      price: "200",
      product: "Canadiano Brewer White Ash",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "890 in stock for 50 variants",
      type: "Brew Gear",
      vendor: "Espresso Shot Coffee",
    },
  ];

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  const rowMarkup = products.map(
    (
      { id, thumbnail, product, price, tone, inventory, type, vendor },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        onClick={() => {
          navigate(`/app/testing`);
        }}
      >
        <IndexTable.Cell>
          <img
            src={"https://picsum.photos/50?random=" + String(index)}
            alt={"product thumbnail" + product}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{product}</IndexTable.Cell>
        <IndexTable.Cell>{tone}</IndexTable.Cell>
        <IndexTable.Cell>{inventory}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  return (
    <Page
      title={"Routines"}
      fullWidth
      // primaryAction={{ content: "Add product" }}
      // secondaryActions={[
      //   {
      //     content: "Export",
      //     accessibilityLabel: "Export product list",
      //     onAction: () => alert("Export action"),
      //   },
      //   {
      //     content: "Import",
      //     accessibilityLabel: "Import product list",
      //     onAction: () => alert("Import action"),
      //   },
      // ]}
    >
      <Card padding="0">
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => {}}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />

        <IndexTable
          resourceName={resourceName}
          itemCount={products.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          sortable={[false, true, true, true, true, true, true]}
          headings={[
            { title: "" },
            { title: "Routine" },
            { title: "Status" },
            { title: "Description" },
            { title: "Category" },
            { title: "Duration" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );
}
