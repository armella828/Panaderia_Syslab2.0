import type { ReactNode } from "react";

import { useAuth } from "../../context/AuthContext";

interface PropiedadesCan {
  codigos: string | string[];
  children: ReactNode;
}

export default function Can({ codigos, children }: PropiedadesCan) {
  const { tienePermiso } = useAuth();

  if (!tienePermiso(codigos)) {
    return null;
  }

  return <>{children}</>;
}