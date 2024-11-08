import {
  Document,
  Page,
  Text,
  View,
  Font,
  usePDF,
  StyleSheet,
  Link,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useFormStore } from "../../store/useFormStore";
import { useState } from "react";
import { HeaderPreview } from "../core/HeaderPreview";
import { SummaryPreview } from "../core/SummaryPreview";
import { Button } from "../ui/button";
import { ExperiencePreview } from "../core/ExperiencePreview";
import { ProjectsPreview } from "../core/ProjectsPreview";

interface PDFDocumentProps {
  formData: Record<string, string | number | boolean>;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ formData }) => {
  Font.register({
    family: "Libre Baskerville",
    src: "http://fonts.gstatic.com/s/librebaskerville/v4/pR0sBQVcY0JZc_ciXjFsKwAUTJOA6-irsSazDq377BE.ttf",
  });

  // bold font
  Font.register({
    family: "Libre Baskerville",
    src: "https://cdn.jsdelivr.net/fontsource/fonts/libre-baskerville@latest/latin-700-normal.ttf",
  });

  // Merriweather light font
  Font.register({
    family: "Merriweather",
    fontStyle: "normal",
    fontWeight: 300,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-300-normal.ttf",
  });

  // Merriweather regular font
  Font.register({
    family: "Merriweather",
    fontStyle: "normal",
    fontWeight: 400,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-400-normal.ttf",
  });

  // Merriweather bold font
  Font.register({
    family: "Merriweather",
    fontStyle: "normal",
    fontWeight: 700,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-700-normal.ttf",
  });

  // Font Roboto slab 100 light
  Font.register({
    family: "Roboto Slab",
    fontStyle: "normal",
    fontWeight: 100,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-slab@latest/latin-100-normal.ttf",
  });

  // Font Roboto slab 200 light
  Font.register({
    family: "Roboto Slab",
    fontStyle: "normal",
    fontWeight: 200,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-slab@latest/latin-200-normal.ttf",
  });

  // Font Roboto slab 300 light
  Font.register({
    family: "Roboto Slab",
    fontStyle: "normal",
    fontWeight: 300,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-slab@latest/latin-300-normal.ttf",
  });

  // Font Roboto slab 400 regular
  Font.register({
    family: "Roboto Slab",
    fontStyle: "normal",
    fontWeight: 400,
    src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-slab@latest/latin-400-normal.ttf",
  });

  const styles = StyleSheet.create({
    document: {
      width: "100%",
      height: "100%",
      padding: 35,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },
    body: {
      paddingTop: 1,
      paddingBottom: 15,
      paddingHorizontal: 15,
      fontFamily: "Roboto Slab",
      fontWeight: 300,
    },
    section: {
      margin: 10,
    },
    name: {
      fontSize: 22,
      textAlign: "center",
      fontWeight: 400,
    },
    title: {
      fontSize: 14,
      textAlign: "center",
    },
    contact: {
      fontSize: 10,
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
    },
    text: {
      fontSize: 10,
      textAlign: "justify",
    },
    heading: {
      fontSize: 14,
      fontWeight: 400,
      borderBottom: 1,
      borderBottomColor: "#001",
      marginBottom: 5,
    },
  });

  return (
    <Document style={styles.document}>
      <Page style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.name}>{formData.name}</Text>
          <Text style={styles.title}>{formData.title}</Text>
          <View style={styles.contact}>
            <Text style={styles.text}>Phone: {formData.phone}</Text>
            <Text style={styles.text}>
              Email:{" "}
              <Link src={`mailto:${formData.email}`}>{formData.email}</Link>
            </Text>
            <Text style={styles.text}>
              LinkedIn:
              <Link src={formData.linkedin}>LinkedIn</Link>
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Summary</Text>
          <Text style={styles.text}>{formData.summary}</Text>
        </View>
      </Page>
    </Document>
  );
};

export const CvPreview: React.FC = () => {
  const { formData } = useFormStore();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const [instance] = usePDF({
    document: <PDFDocument formData={formData} />,
  });

  return (
    <div className="flex flex-col gap-4 w-3/5 min-h-[90dvh]">
      <Button variant="default" size="default" className="self-end" asChild>
        <PDFDownloadLink
          document={<PDFDocument formData={formData} />}
          fileName="cv.pdf"
        >
          Download PDF
        </PDFDownloadLink>
      </Button>
      <div className="flex-1 w-full font-libre shadow-2xl px-8 py-4">
        <HeaderPreview />
        <SummaryPreview />
        <ExperiencePreview />
        <ProjectsPreview />
      </div>

      {/* <PDFViewer className="flex-1 w-full " height="800">
        <PDFDocument formData={formData} />
      </PDFViewer> */}
    </div>
  );
};
