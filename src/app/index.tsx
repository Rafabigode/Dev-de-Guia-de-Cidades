import { ScrollView, StyleSheet, Text, View } from "react-native";

const habilidades = [
  { id: "1", titulo: "Habilidade 1", descricao: "Descrição 1." },
  { id: "2", titulo: "Habilidade 2", descricao: "Descrição 2." },
  { id: "3", titulo: "Habilidade 3", descricao: "Descrição 3." },
  { id: "4", titulo: "Habilidade 4", descricao: "Descrição 4." },
  { id: "5", titulo: "Habilidade 5", descricao: "Descrição 5." },
  { id: "6", titulo: "Habilidade 6", descricao: "Descrição 6." },
];

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Meu Portfólio Mobile</Text>
      {habilidades.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardDesc}>{item.descricao}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardDesc: { fontSize: 14, color: "#666", marginTop: 5 },
});
