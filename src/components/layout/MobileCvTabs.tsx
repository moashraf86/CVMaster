import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CvForm } from "./CvForm";
import { Preview } from "./Preview";

export const MobileCvTabs: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-6 ">
      <Tabs defaultValue="preview">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit CV</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <CvForm />
        </TabsContent>
        <TabsContent value="preview">
          <Preview />
        </TabsContent>
      </Tabs>
    </div>
  );
};
