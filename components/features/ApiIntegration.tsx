'use client';

import { useState } from 'react';
import { Activity, Clock, Copy, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { AppConfigWithTenant, Tenant } from '@/types';
import { storage } from '@/lib/utils/storage';

interface ApiIntegrationProps {
  config: AppConfigWithTenant;
  tenant: Tenant;
}

type CodeLanguage = 'ts' | 'js' | 'go' | 'dart';

export function ApiIntegration({ config, tenant }: ApiIntegrationProps) {
  const { success } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeLanguage>('js');
  const supabaseUrl = storage.getSupabaseUrl();
  const supabaseAnonKey = storage.getSupabaseAnonKey();
  
  // Use PostgREST RPC function to get published_json directly (returns JSON, not array)
  // Alternative: Use table endpoint and extract published_json from array response
  const rpcEndpoint = `${supabaseUrl}/rest/v1/rpc/get_published_config`;
  const tableEndpoint = `${supabaseUrl}/rest/v1/app_configs?key_name=eq.${config.key_name}&tenant_id=eq.${config.tenant_id}&select=published_json&limit=1`;
  
  // Recommended: Use RPC function (returns JSON directly)
  const curlCommandRpc = `curl -X POST "${rpcEndpoint}" \\
  -H "apikey: ${supabaseAnonKey || 'your-anon-key'}" \\
  -H "Content-Type: application/json" \\
  -d '{"p_key_name": "${config.key_name}", "p_tenant_id": "${config.tenant_id}"}'`;
  
  // Alternative: Use table endpoint (returns array, need to extract published_json)
  const curlCommandTable = `curl -X GET "${tableEndpoint}" \\
  -H "apikey: ${supabaseAnonKey || 'your-anon-key'}"`;
  
  // JavaScript example using RPC function (recommended)
  const jsExampleRpc = `// Using RPC function - returns JSON directly
const response = await fetch('${rpcEndpoint}', {
  method: 'POST',
  headers: {
    'apikey': '${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    p_key_name: '${config.key_name}',
    p_tenant_id: '${config.tenant_id}'
  })
});
const config = await response.json(); // Direct JSON, no array!`;
  
  // JavaScript example using table endpoint (alternative)
  const jsExampleTable = `// Using table endpoint - returns array, extract published_json
const response = await fetch('${tableEndpoint}', {
  headers: { 'apikey': '${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}' }
});
const data = await response.json();
const config = data[0]?.published_json || {}; // Extract from array`;

  // TypeScript example using RPC function (recommended)
  const tsExampleRpc = `// Using RPC function - returns JSON directly
interface ConfigResponse {
  [key: string]: any;
}

const response = await fetch('${rpcEndpoint}', {
  method: 'POST',
  headers: {
    'apikey': '${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    p_key_name: '${config.key_name}',
    p_tenant_id: '${config.tenant_id}'
  })
});
const config: ConfigResponse = await response.json(); // Direct JSON, no array!`;
  
  // TypeScript example using table endpoint (alternative)
  const tsExampleTable = `// Using table endpoint - returns array, extract published_json
interface TableResponse {
  published_json: Record<string, any>;
}

const response = await fetch('${tableEndpoint}', {
  headers: { 'apikey': '${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}' }
});
const data: TableResponse[] = await response.json();
const config = data[0]?.published_json || {}; // Extract from array`;

  // Go example using RPC function (recommended)
  const goExampleRpc = `// Using RPC function - returns JSON directly
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type ConfigResponse map[string]interface{}

func fetchConfig() (ConfigResponse, error) {
    url := "${rpcEndpoint}"
    payload := map[string]string{
        "p_key_name": "${config.key_name}",
        "p_tenant_id": "${config.tenant_id}",
    }
    
    jsonData, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    req.Header.Set("apikey", "${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var config ConfigResponse
    json.NewDecoder(resp.Body).Decode(&config)
    return config, nil
}`;
  
  // Go example using table endpoint (alternative)
  const goExampleTable = `// Using table endpoint - returns array, extract published_json
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type TableResponse struct {
    PublishedJSON map[string]interface{} \`json:"published_json"\`
}

func fetchConfig() (map[string]interface{}, error) {
    url := "${tableEndpoint}"
    req, _ := http.NewRequest("GET", url, nil)
    req.Header.Set("apikey", "${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var data []TableResponse
    json.NewDecoder(resp.Body).Decode(&data)
    
    if len(data) > 0 {
        return data[0].PublishedJSON, nil
    }
    return make(map[string]interface{}), nil
}`;

  // Dart example using RPC function (recommended)
  const dartExampleRpc = `// Using RPC function - returns JSON directly
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> fetchConfig() async {
  final url = Uri.parse('${rpcEndpoint}');
  
  final response = await http.post(
    url,
    headers: {
      'apikey': '${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'p_key_name': '${config.key_name}',
      'p_tenant_id': '${config.tenant_id}',
    }),
  );
  
  if (response.statusCode == 200) {
    return jsonDecode(response.body) as Map<String, dynamic>;
  } else {
    throw Exception('Failed to load config');
  }
}`;
  
  // Dart example using table endpoint (alternative)
  const dartExampleTable = `// Using table endpoint - returns array, extract published_json
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> fetchConfig() async {
  final url = Uri.parse('${tableEndpoint}');
  
  final response = await http.get(
    url,
    headers: {
      'apikey': '${supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIs...'}',
    },
  );
  
  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(response.body);
    if (data.isNotEmpty) {
      return data[0]['published_json'] as Map<String, dynamic>;
    }
    return {};
  } else {
    throw Exception('Failed to load config');
  }
}`;

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return 'more than an hour ago';
  };

  const handleCopyApiKey = () => {
    if (supabaseAnonKey) {
      navigator.clipboard.writeText(supabaseAnonKey);
      success('API key copied to clipboard');
    }
  };

  const getObscuredKey = (key: string | null) => {
    if (!key) return 'Not set';
    if (key.length <= 8) return '••••••••';
    return `${key.substring(0, 8)}${'•'.repeat(Math.min(key.length - 8, 20))}`;
  };

  const getCodeExample = (method: 'rpc' | 'table', language: CodeLanguage): string => {
    if (method === 'rpc') {
      switch (language) {
        case 'ts': return tsExampleRpc;
        case 'js': return jsExampleRpc;
        case 'go': return goExampleRpc;
        case 'dart': return dartExampleRpc;
      }
    } else {
      switch (language) {
        case 'ts': return tsExampleTable;
        case 'js': return jsExampleTable;
        case 'go': return goExampleTable;
        case 'dart': return dartExampleTable;
      }
    }
  };

  const CodeTabs = ({ method }: { method: 'rpc' | 'table' }) => {
    const getLanguageLabel = (lang: CodeLanguage): string => {
      switch (lang) {
        case 'ts': return 'TypeScript';
        case 'js': return 'JavaScript';
        case 'go': return 'Go';
        case 'dart': return 'Dart';
      }
    };

    const getSyntaxLanguage = (lang: CodeLanguage): string => {
      switch (lang) {
        case 'ts': return 'typescript';
        case 'js': return 'javascript';
        case 'go': return 'go';
        case 'dart': return 'dart';
      }
    };

    return (
      <div className="mt-2">
        <div className="flex items-center gap-1 mb-2 border-b border-gray-200">
          {(['ts', 'js', 'go', 'dart'] as CodeLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === lang
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
        <CodeBlock 
          code={getCodeExample(method, activeTab)} 
          language={getSyntaxLanguage(activeTab)}
          copyable={true} 
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader title="API Integration" />
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Use this endpoint to fetch published configuration data in your application. 
            The Supabase Anon Key is automatically included in the request headers for authentication.
          </p>
          {!config.last_published_at && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ This config has not been published yet. You must publish it first before it will be available via API.
            </div>
          )}
        </div>

        {/* API Examples */}
        <div className="space-y-4">
          {/* RPC Function Method (Recommended) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
              Method 1: RPC Function (Recommended) - Returns JSON Directly
            </label>
            <CodeBlock code={curlCommandRpc} language="bash" />
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
              ✓ Returns JSON directly: <code className="bg-white px-1 rounded">{"{"}"en": {"{"}...{"}"}, "es": {"{"}...{"}"}{"}"}</code>
            </div>
            <CodeTabs method="rpc" />
          </div>

          {/* Table Endpoint Method (Alternative) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
              Method 2: Table Endpoint (Alternative) - Returns Array
            </label>
            <CodeBlock code={curlCommandTable} language="bash" />
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ Returns array: <code className="bg-white px-1 rounded">[{"{"}"published_json": {"{"}...{"}"}{"}"}]</code> - Extract <code className="bg-white px-1 rounded">data[0].published_json</code>
            </div>
            <CodeTabs method="table" />
          </div>
        </div>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">API Key Information:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-700 font-medium whitespace-nowrap">apikey header:</span>
                <code className="flex-1 text-xs bg-white px-2 py-1 rounded border border-blue-200 font-mono text-blue-900 break-all overflow-hidden min-w-0">
                  {showApiKey ? (supabaseAnonKey || 'Not set') : getObscuredKey(supabaseAnonKey)}
                </code>
                <Button
                  variant="ghost"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-7 px-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 flex-shrink-0"
                  icon={showApiKey ? EyeOff : Eye}
                />
                <Button
                  variant="ghost"
                  onClick={handleCopyApiKey}
                  className="h-7 px-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 flex-shrink-0"
                  icon={Copy}
                  disabled={!supabaseAnonKey}
                />
              </div>
              <p className="text-xs text-blue-600">
                Use your Supabase Anon Key (from connection settings). This endpoint uses public anonymous access. Only the apikey header is required.
              </p>
            </div>
          </div>

        {/* Statistics */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>{config.request_count.toLocaleString()} requests</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              Last called: {config.last_published_at ? formatRelativeTime(config.last_published_at) : 'never'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

