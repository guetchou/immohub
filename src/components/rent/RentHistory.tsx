import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RentHistory = () => {
  const transactions = [
    {
      id: 1,
      date: "2024-04-01",
      amount: 350000,
      status: "Payé",
      method: "MTN Money",
      reference: "MTN123456",
    },
    {
      id: 2,
      date: "2024-03-01",
      amount: 350000,
      status: "Payé",
      method: "Airtel Money",
      reference: "AIR789012",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des Paiements</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Montant (FCFA)</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Référence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.amount.toLocaleString()}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell>{transaction.method}</TableCell>
              <TableCell>{transaction.reference}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RentHistory;