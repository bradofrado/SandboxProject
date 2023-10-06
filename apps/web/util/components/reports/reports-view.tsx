import { useState } from "react";
import type { HexColor } from "model/src/core/colors";
import { formatDollarAmount } from "model/src/utils";
import { Card } from "ui/src/components/core/card";
import { Header } from "ui/src/components/core/header";
import { Pill } from "ui/src/components/core/pill";
import { ProfileImage } from "ui/src/components/feature/profile/profile-image";
import { StatusLaneContainer } from "ui/src/components/feature/reporting/status-lane";

interface ARClient {
  id: number;
  columnId: number;
  name: string;
  description: string;
  amount: number;
  status: string;
  profileImage: string;
}

interface ARCategory {
  id: number;
  label: string;
  fill: HexColor;
}

export const ReportingView: React.FunctionComponent = () => {
  const [items, setItems] = useState<ARClient[]>([
    {
      name: "Bob Jones",
      description: "thing",
      amount: 500,
      status: "Follow up",
      profileImage: "braydon.jpeg",
      id: 3,
      columnId: 0,
    },
    {
      name: "Jennifer Jones",
      description: "thing",
      amount: 2000,
      status: "Follow up",
      profileImage: "braydon.jpeg",
      id: 10,
      columnId: 0,
    },
    {
      name: "Job Jones",
      description: "thing",
      amount: 1000,
      status: "Follow up",
      profileImage: "braydon.jpeg",
      id: 5,
      columnId: 0,
    },
  ]);

  const columns: ARCategory[] = [
    {
      id: 0,
      label: "Nothing",
      fill: "#e2e8f0",
    },
    {
      id: 1,
      label: "Interested",
      fill: "#14b8a6",
    },
    {
      id: 2,
      label: "Committed",
      fill: "#1679d3",
    },
  ];

  // Include every column except the first one in the progress bar
  const columnsToIncludeInProgressBar = columns
    .filter((column) => column.id > 0)
    .map((column) => column.id);

  return (
    <div className="p-8">
      <Header level={1}>Reporting</Header>
      <StatusLaneContainer
        columns={columns}
        columnsToIncludeInProgressBar={columnsToIncludeInProgressBar}
        items={items}
        setItems={setItems}
      >
        {(item, isDragging) => <ARClientCard {...item} outline={isDragging} />}
      </StatusLaneContainer>
    </div>
  );
};

type ARClientCardProps = Omit<ARClient, "id" | "columnId"> & {
  outline: boolean;
};
const ARClientCard: React.FunctionComponent<ARClientCardProps> = ({
  name,
  description,
  amount,
  status,
  profileImage,
  outline,
}) => {
  if (outline) {
    return <Card className="h-[222px]" />;
  }
  const labelPill = <Pill>{status}</Pill>;
  return (
    <div>
      <Card
        items={[{ name: "Edit", id: "0" }]}
        label={labelPill}
        onChange={() => undefined}
      >
        <Header level={5}>{name}</Header>
        <p>{description}</p>
        <div className="flex justify-between mt-2">
          <span className="text-3xl font-bold">
            {formatDollarAmount(amount)}
          </span>
          <ProfileImage className="w-10 h-10" image={profileImage} />
        </div>
      </Card>
    </div>
  );
};
