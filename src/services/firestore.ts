import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type StatusEstudo = "Planejado" | "Em andamento" | "Concluído";

export type RegistroEstudo = {
  id: string;
  materia: string;
  assunto: string;
  data: string;
  tempoEstudo: string;
  status: StatusEstudo;
  criadoEm?: Timestamp;
};

function registrosRef(uid: string) {
  return collection(db, "usuarios", uid, "registros");
}

function mapRegistro(id: string, data: DocumentData): RegistroEstudo {
  return {
    id,
    materia: data.materia ?? "",
    assunto: data.assunto ?? "",
    data: data.data ?? "",
    tempoEstudo: data.tempoEstudo ?? "",
    status: data.status ?? "Planejado",
    criadoEm: data.criadoEm,
  };
}

export async function listarRegistros(uid: string): Promise<RegistroEstudo[]> {
  const consulta = query(registrosRef(uid), orderBy("criadoEm", "desc"));
  const snapshot = await getDocs(consulta);
  return snapshot.docs.map((item) => mapRegistro(item.id, item.data()));
}

export async function criarRegistro(
  uid: string,
  registro: Omit<RegistroEstudo, "id" | "criadoEm">,
) {
  await addDoc(registrosRef(uid), {
    ...registro,
    criadoEm: serverTimestamp(),
  });
}

export async function atualizarRegistro(
  uid: string,
  registroId: string,
  registro: Omit<RegistroEstudo, "id" | "criadoEm">,
) {
  const referencia = doc(db, "usuarios", uid, "registros", registroId);
  await updateDoc(referencia, registro);
}

export async function excluirRegistro(uid: string, registroId: string) {
  const referencia = doc(db, "usuarios", uid, "registros", registroId);
  await deleteDoc(referencia);
}
