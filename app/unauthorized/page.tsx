import { Container, Section } from "@/components/common";

export default function UnauthorizedPage() {
  return (
    <Section padding="xl">
      <Container size="sm">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-slate-600">You do not have permission to view this page.</p>
        </div>
      </Container>
    </Section>
  );
}

