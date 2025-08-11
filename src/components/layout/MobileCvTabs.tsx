import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { CvForm } from "./CvForm";
import { Preview } from "./Preview";
import { SquarePen, TvMinimal } from "lucide-react";

const PersistentTabsContent = ({
  value,
  activeValue,
  children,
}: {
  value: string;
  activeValue: string;
  children: React.ReactNode;
}) => (
  <div className={activeValue === value ? "block" : "hidden"}>{children}</div>
);

export const MobileCvTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="gap-2">
            <SquarePen className="size-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <TvMinimal className="size-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        {/* Both components always mounted, visibility controlled */}
        <PersistentTabsContent value="edit" activeValue={activeTab}>
          <CvForm />
        </PersistentTabsContent>
        <PersistentTabsContent value="preview" activeValue={activeTab}>
          <Preview />
        </PersistentTabsContent>
      </Tabs>
    </div>
  );
};
