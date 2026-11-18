import Table from '../atoms/Table';
import AdminRow from '../molecules/AdminRow';

function StockTable({ products, onSave, onDelete }) {
  return (
    <Table responsive hover className="align-middle">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Imagen</Table.HeaderCell>
          <Table.HeaderCell>Nombre</Table.HeaderCell>
          <Table.HeaderCell>Precio</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
          <Table.HeaderCell>Acciones</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {products.map((p) => (
          <AdminRow key={p.id} product={p} onSave={onSave} onDelete={onDelete} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default StockTable;