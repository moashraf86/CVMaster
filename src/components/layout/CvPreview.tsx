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
  PDFViewer,
} from "@react-pdf/renderer";
import { useFormStore } from "../../store/useFormStore";
import { useEffect } from "react";
import { HeaderPreview } from "../core/HeaderPreview";
import { SummaryPreview } from "../core/SummaryPreview";
import { ExperiencePreview } from "../core/ExperiencePreview";
import { ProjectsPreview } from "../core/ProjectsPreview";
import { SKillsPreview } from "../core/SkillsPreview";

interface PDFDocumentProps {
  formData: Record<string, string | number | boolean>;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ formData }) => {
  // const { name, title, phone, email, linkedin, summary } =
  // formData.personalInfo[0] || {};

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

      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      fontFamily: "Merriweather",
    },
    body: {
      width: "100%",
      height: "100%",
      paddingLeft: 15,
      paddingRight: 15,
      fontFamily: "Roboto Slab",
      fontWeight: 300,
    },
    section: {
      margin: 10,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    name: {
      fontSize: 22,
      textAlign: "center",
      fontWeight: 700,
      display: "flex",
      justifyContent: "center",
    },
    title: {
      fontSize: 14,
      textAlign: "center",
      fontFamily: "Roboto Slab",
      display: "flex",
      justifyContent: "center",
    },
    contact: {
      fontSize: 10,
      display: "flex",
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
      fontFamily: "Merriweather",
    },
    link: {
      color: "black",
    },
  });

  useEffect(() => {
    console.log(name);
  }, [formData]);
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
              <Link style={styles.link} src={`mailto:${formData.email}`}>
                {formData.email}
              </Link>
            </Text>
            <Text style={styles.text}>
              LinkedIn:
              <Link style={styles.link} src={formData.linkedIn}>
                LinkedIn
              </Link>
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

  const [instance] = usePDF({
    document: <PDFDocument formData={formData} />,
  });

  return (
    <div className="flex flex-col gap-4 w-3/5 min-h-[90dvh]">
      <div className="flex-1 w-full font-libre shadow-2xl px-8 py-4">
        <HeaderPreview />
        <SummaryPreview />
        <ExperiencePreview />
        <ProjectsPreview />
        <SKillsPreview />
      </div>
    </div>
  );
};
