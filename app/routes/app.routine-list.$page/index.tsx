import {
  Await,
  json,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import {
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  Badge,
  Page,
} from "@shopify/polaris";
import type { SortButtonChoice } from "@shopify/polaris";
import { useState, useCallback, useEffect, Suspense } from "react";

import RowActions from "~/components/routine-list/RowActions";
import { api } from "~/utils/axios";
import { defer, LoaderFunctionArgs } from "@remix-run/node";
import { RoutineListType } from "./types";
import RoutineListSkeleton from "../../components/routine-list/loaders/RoutineListSkeleton";
import { cloneRoutine, deleteRoutine, fetchRoutineList } from "./api";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = formData.get("id") as string;

  if (!id) {
    return json({ success: false, toast: "Invalid ID" });
  }

  if (intent === "delete") {
    const response = await deleteRoutine(id);
    return response;
  } else if (intent === "clone") {
    const response = await cloneRoutine(id);
    return response;
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const page = Number(params.page ?? 1);

  const response = fetchRoutineList(Number(page));
  return defer({ routines: response });
}

export default function IndexFiltersDefault() {
  const navigate = useNavigate();

  const { routines } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      shopify.toast.show(actionData.toast, {
        duration: 3000,
        isError: !actionData.success,
      });

      setShowDeleteModal(false);
    }
  }, [actionData]);

  //Mode For IndexFilters
  const { mode, setMode } = useSetIndexFiltersMode();

  //Resolved Routines
  const [resolvedRoutines, setResolvedRoutines] = useState<RoutineListType[]>(
    [],
  );

  //Routine Loading
  const [isRoutinesLoading, setIsRoutinesLoading] = useState(true);

  //Delete Confirm Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    routines
      .then((data) => {
        if (data.success && data.data.docs) {
          setResolvedRoutines(data.data.docs ?? []);
          setFilteredRoutines(data.data.docs ?? []);
          setPageData({
            page: data.data.page,
            hasNextPage: data.data.hasNextPage,
            hasPrevPage: data.data.hasPrevPage,
          });
        }
      })
      .finally(() => {
        setIsRoutinesLoading(false);
      });
  }, [routines]);

  //Filtered Routines
  const [filteredRoutines, setFilteredRoutines] = useState<RoutineListType[]>(
    [],
  );

  //Page Data

  const [pageData, setPageData] = useState({
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  //Tab Items
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Active",
    "Draft",
    "Private",
    "Public",
  ]);

  //Tabs
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions: [],
  }));

  //Selected Tab
  const [selected, setSelected] = useState(0);

  //Sort Options
  const sortOptions: SortButtonChoice[] = [
    { label: "Routine", value: "routine asc", directionLabel: "A-Z" },
    { label: "Routine", value: "routine desc", directionLabel: "Z-A" },
    { label: "Category", value: "category asc", directionLabel: "A-Z" },
    { label: "Category", value: "category desc", directionLabel: "Z-A" },
    { label: "Duration", value: "duration asc", directionLabel: "Ascending" },
    { label: "Duration", value: "duration desc", directionLabel: "Descending" },
  ];

  //Sort Selected
  const [sortSelected, setSortSelected] = useState(["routine asc"]);

  //Search Query Value
  const [queryValue, setQueryValue] = useState("");

  // Handle Tab Selection (Filter Routines by Status)
  const handleTabSelect = useCallback(
    (index: number) => {
      setSelected(index);

      // Filter routines based on selected tab

      let filtered = resolvedRoutines;
      if (index === 1)
        filtered = (resolvedRoutines as RoutineListType[]).filter(
          (r) => !r.draft,
        );
      // Active
      else if (index === 2)
        filtered = (resolvedRoutines as RoutineListType[]).filter(
          (r) => r.draft,
        );
      // Draft
      else if (index === 3)
        filtered = (resolvedRoutines as RoutineListType[]).filter(
          (r) => r.visibility === "Private",
        );
      // Private
      else if (index === 4)
        filtered = (resolvedRoutines as RoutineListType[]).filter(
          (r) => r.visibility === "Public",
        ); // Public

      // Update state with filtered routines
      setFilteredRoutines(filtered);
    },
    [resolvedRoutines],
  );

  // Handle Search Input (Filter by Name or Category)
  const handleFiltersQueryChange = useCallback(
    (value: string) => {
      setQueryValue(value);

      const filtered = resolvedRoutines.filter(
        (routine: RoutineListType) =>
          routine.name.toLowerCase().includes(value.toLowerCase()) ||
          routine.category?.name?.toLowerCase().includes(value.toLowerCase()),
      );

      setFilteredRoutines(filtered);
    },
    [resolvedRoutines],
  );

  // Handle Clear Search Input
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    setFilteredRoutines(resolvedRoutines); // Reset to all routines
  }, [resolvedRoutines]);

  const resourceName = {
    singular: "routine",
    plural: "routines",
  };

  const rowMarkup = filteredRoutines.map(
    ({ _id, name, draft, category, image, description, duration }, index) => (
      <IndexTable.Row
        id={_id}
        key={_id}
        position={index}
        onClick={() => {
          navigate(`/app/routine/${_id}`);
        }}
      >
        <IndexTable.Cell>
          <img
            src={image}
            style={{ width: "50px", height: "50px", borderRadius: "8px" }}
            alt={"product thumbnail" + name}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>
          {draft ? (
            <Badge tone="info">Draft</Badge>
          ) : (
            <Badge tone="success">Active</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>{description.slice(0, 40)}...</IndexTable.Cell>
        <IndexTable.Cell>{category?.name}</IndexTable.Cell>
        <IndexTable.Cell>
          {duration.number + " " + duration.unit}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <RowActions
            key={_id}
            id={_id}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page
      title="Routines"
      fullWidth
      primaryAction={{
        content: "Add Routine",
        onAction: () => {
          navigate("/app/add-routine/");
        },
      }}
    >
      <Card padding="0">
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          filters={[]}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => handleQueryValueRemove()}
          onClearAll={() => {}}
          onSort={setSortSelected}
          cancelAction={{
            onAction: () => {},
            disabled: false,
            loading: false,
          }}
          canCreateNewView={false}
          tabs={tabs}
          selected={selected}
          onSelect={handleTabSelect}
          mode={mode}
          setMode={setMode}
        />

        <IndexTable
          selectable={false}
          resourceName={resourceName}
          itemCount={isRoutinesLoading ? 10 : filteredRoutines.length}
          sortable={[false, true, true, true, true, true, true]}
          headings={[
            { title: "Image" },
            { title: "Routine" },
            { title: "Status" },
            { title: "Description" },
            { title: "Category" },
            { title: "Duration" },
            { title: "Actions" },
          ]}
          pagination={{
            hasNext: pageData.hasNextPage,
            hasPrevious: pageData.hasPrevPage,
            onNext: () => {
              navigate(`/app/routine-list/${pageData.page + 1}`);
            },
            onPrevious: () => {
              navigate(`/app/routine-list/${pageData.page - 1}`);
            },
          }}
        >
          <Suspense fallback={<RoutineListSkeleton />} key={useParams().page}>
            <Await resolve={routines} errorElement={<p>Some Error Occured</p>}>
              {rowMarkup}
            </Await>
          </Suspense>
        </IndexTable>
      </Card>
    </Page>
  );
}
