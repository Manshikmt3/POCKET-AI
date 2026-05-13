import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function MonthlyReportEmail({
  userName = "User",
  month = "May",
  stats = { income: "5000", expenses: "3500" },
  insights = ["You spent 20% more on food this month.", "Consider saving an extra $200."],
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Monthly Financial Report for {month}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Pocket AI: {month} Report</Heading>
          <Text style={text}>Hi {userName}, here is your financial summary for {month}.</Text>
          
          <Section style={statsContainer}>
            <div style={statItem}>
              <Text style={statLabel}>Total Income</Text>
              <Text style={statValue}>${stats.income}</Text>
            </div>
            <div style={statItem}>
              <Text style={statLabel}>Total Expenses</Text>
              <Text style={statValue}>${stats.expenses}</Text>
            </div>
          </Section>

          <Section style={insightSection}>
            <Text style={subheading}>AI Insights</Text>
            {insights.map((insight, i) => (
              <Text key={i} style={insightText}>• {insight}</Text>
            ))}
          </Section>

          <Text style={footer}>
            Manage your finances better with Pocket AI.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  borderRadius: "5px",
  maxWidth: "580px",
};

const h1 = {
  color: "#22c55e",
  fontSize: "24px",
  textAlign: "center",
};

const text = {
  padding: "0 48px",
};

const statsContainer = {
  padding: "24px 48px",
  display: "flex",
};

const statItem = { flex: 1 };
const statLabel = { color: "#8898aa", fontSize: "12px" };
const statValue = { fontSize: "20px", fontWeight: "bold" };

const insightSection = {
  padding: "0 48px",
};

const subheading = { fontWeight: "bold", fontSize: "18px" };
const insightText = { fontSize: "14px", color: "#525f7f" };

const footer = {
  textAlign: "center",
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "48px",
};
