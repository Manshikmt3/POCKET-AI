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

export default function BudgetAlertEmail({
  userName = "User",
  percentage = "80",
  budgetAmount = "1000",
  currentExpenses = "800",
}) {
  return (
    <Html>
      <Head />
      <Preview>Budget Alert: You&apos;ve reached {percentage}% of your limit</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Pocket AI Budget Alert</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            You have used <strong>{percentage}%</strong> of your monthly budget.
          </Text>
          <Section style={statsContainer}>
            <div style={statItem}>
              <Text style={statLabel}>Monthly Budget</Text>
              <Text style={statValue}>${budgetAmount}</Text>
            </div>
            <div style={statItem}>
              <Text style={statLabel}>Current Expenses</Text>
              <Text style={statValue}>${currentExpenses}</Text>
            </div>
          </Section>
          <Text style={footer}>
            Stay on track with your financial goals! Log in to Pocket AI to see more details.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e6ebf1",
  borderRadius: "5px",
  maxWidth: "580px",
};

const h1 = {
  color: "#22c55e",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "30px 0",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left",
  padding: "0 48px",
};

const statsContainer = {
  padding: "24px 48px",
  display: "flex",
  justifyContent: "space-between",
};

const statItem = {
  flex: "1",
};

const statLabel = {
  color: "#8898aa",
  fontSize: "12px",
  textTransform: "uppercase",
  marginBottom: "4px",
};

const statValue = {
  color: "#32325d",
  fontSize: "20px",
  fontWeight: "bold",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center",
  marginTop: "48px",
  padding: "0 48px",
};
