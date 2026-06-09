import os
import sqlite3
import json
from datetime import datetime

class ToolRegistry:
    def __init__(self):
        self.tools = {}
        self._register_default_tools()

    def _register_default_tools(self):
        self.register("buscar_informacao", self._tool_buscar_informacao, 
            "Busca informacoes basicas do banco de dados (ex: numero de agentes, provedores). Nao recebe parametros complexos.")
        self.register("escrever_relatorio_simples", self._tool_escrever_relatorio_simples, 
            "Escreve um txt simples com log de operacao. Parametros via JSON string: {'texto': '...'} ")

    def register(self, name, func, description):
        self.tools[name] = {"func": func, "description": description}

    def get_tool_descriptions(self):
        desc = []
        for name, data in self.tools.items():
            desc.append(f"- {name}: {data['description']}")
        return "\n".join(desc)

    def execute(self, tool_name, *args, **kwargs):
        if tool_name not in self.tools:
            return f"Erro: Ferramenta '{tool_name}' não encontrada."
        try:
            return self.tools[tool_name]["func"](*args, **kwargs)
        except Exception as e:
            return f"Erro na execucao da ferramenta {tool_name}: {str(e)}"

    # --- IMPLEMENTAÇÕES BÁSICAS DAS FERRAMENTAS ---
    def _tool_buscar_informacao(self, *args, **kwargs):
        # Apenas um dummy inicial para provar que a ferramenta funciona sem quebrar o BD real
        return "Temos agentes registrados no nexus.db. O banco esta operacional."
    
    def _tool_escrever_relatorio_simples(self, json_args_str):
        try:
            data = json.loads(json_args_str)
            with open("agentic_report_test.txt", "w") as f:
                f.write(data.get("texto", "Relatorio vazio."))
            return "Relatorio escrito com sucesso."
        except Exception as e:
            return f"Falha ao ler json da ferramenta de escrever: {e}"
