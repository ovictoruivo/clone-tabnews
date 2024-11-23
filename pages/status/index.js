import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <p className="secondary">
      Última atualização em:{" "}
      <span style={{ color: "#18a65e" }}>{updatedAtText}</span>
    </p>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseVersion = "Carregando...";
  let databaseMaxConnections = "Carregando...";
  let databaseOpenedConnections = "Carregando...";

  if (!isLoading && data) {
    databaseVersion = data.dependencies.database.version;
    databaseMaxConnections = data.dependencies.database.max_connections;
    databaseOpenedConnections = data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h2>Banco de Dados</h2>
      <p className="secondary">
        Versão: <span style={{ color: "#18a65e" }}>{databaseVersion}</span>
      </p>
      <p className="secondary">
        Conexões máximas:{" "}
        <span style={{ color: "#18a65e" }}>{databaseMaxConnections}</span>
      </p>
      <p className="secondary">
        Conexões abertas:{" "}
        <span style={{ color: "#18a65e" }}>{databaseOpenedConnections}</span>
      </p>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}
