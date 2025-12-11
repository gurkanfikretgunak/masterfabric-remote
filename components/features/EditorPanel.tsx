'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Rocket, AlertCircle, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { isValidJSON, formatJSON } from '@/lib/utils/json';
import { templates, TemplateType } from '@/lib/utils/templates';

interface EditorPanelProps {
  title: 'Draft' | 'Published';
  json: Record<string, any>;
  editable: boolean;
  onSave?: (json: Record<string, any>) => Promise<void>;
  onPublish?: () => Promise<void>;
  lastPublished?: string | null;
}

export function EditorPanel({
  title,
  json,
  editable,
  onSave,
  onPublish,
  lastPublished,
}: EditorPanelProps) {
  const [value, setValue] = useState(formatJSON(json));
  const [isValid, setIsValid] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(formatJSON(json));
    setHasChanges(false);
    // Reset draftSaved when json changes externally (e.g., after publish)
    setDraftSaved(false);
  }, [json]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateRef.current && !templateRef.current.contains(event.target as Node)) {
        setShowTemplates(false);
      }
    };

    if (showTemplates) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplates]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setHasChanges(true);
    setIsValid(isValidJSON(newValue));
  };

  const handleSave = async () => {
    if (!isValid || !onSave) return;

    setSaving(true);
    try {
      const parsed = JSON.parse(value);
      await onSave(parsed);
      setHasChanges(false);
      setDraftSaved(true); // Mark draft as saved, enable Publish button
    } catch (err) {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handlePublishClick = () => {
    if (!isValid || !onPublish) return;
    setShowPublishDialog(true);
  };

  const handlePublishConfirm = async (option: string) => {
    if (!isValid || !onPublish) return;

    setShowPublishDialog(false);
    setPublishing(true);
    try {
      await onPublish();
      setHasChanges(false);
      setDraftSaved(false); // Reset after successful publish
    } catch (err) {
      // Error handled by parent
    } finally {
      setPublishing(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleTemplateSelect = (templateType: TemplateType) => {
    const template = templates.find((t) => t.type === templateType);
    if (template && editable) {
      setValue(formatJSON(template.json));
      setHasChanges(true);
      setIsValid(true);
      setShowTemplates(false);
    }
  };

  const handleRestore = () => {
    setValue(formatJSON(json));
    setHasChanges(false);
    setIsValid(true);
  };

  const isPublished = title === 'Published';
  
  // Check if there's draft content to publish
  // Enable publish if: draft was saved, has unsaved changes, or there's existing draft content
  const hasDraftContent = draftSaved || hasChanges || (json && JSON.stringify(json) !== '{}');

  return (
    <Card className={isPublished ? 'border-green-200 bg-green-50/20' : ''}>
      <CardHeader
        title={title}
        titleColor={isPublished ? 'text-green-700' : 'text-gray-900'}
        borderColor={isPublished ? 'border-green-200' : 'border-gray-200'}
        action={
          editable ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {hasChanges && (
                <Button
                  variant="ghost"
                  onClick={handleRestore}
                  icon={RotateCcw}
                  className="text-xs px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Restore</span>
                  <span className="sm:hidden">Restore</span>
                </Button>
              )}
              <div className="relative" ref={templateRef}>
                <Button
                  variant="ghost"
                  onClick={() => setShowTemplates(!showTemplates)}
                  icon={FileText}
                  className="text-xs px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Templates</span>
                  <span className="sm:hidden">Templates</span>
                </Button>
                {showTemplates && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg z-50">
                    <div className="p-2">
                      {templates.map((template) => (
                        <button
                          key={template.type}
                          onClick={() => handleTemplateSelect(template.type)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-all duration-200 hover:translate-x-1 active:scale-95"
                        >
                          <div className="font-medium text-gray-900">{template.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{template.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            lastPublished && (
              <span className="text-xs text-green-600 font-medium">
                Last published: {formatRelativeTime(lastPublished)}
              </span>
            )
          )
        }
      />
      {isPublished && (
        <div className="px-6 py-2 border-b border-green-200 bg-green-50/30">
          <p className="text-xs text-green-700">
            This is the live published version served to your applications via API.
          </p>
        </div>
      )}
      <CardContent>
        <div
          className={`rounded-lg border overflow-hidden ${
            isValid ? 'border-gray-200' : 'border-red-300 bg-red-50'
          }`}
        >
          {editable ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                // Allow standard keyboard shortcuts (Cmd/Ctrl + A, C, V, X, Z, etc.)
                const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
                
                // Handle: Cmd/Ctrl + A (Select All)
                if (cmdOrCtrl && (e.key === 'a' || e.key === 'A')) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (textareaRef.current) {
                    textareaRef.current.select();
                  }
                  return;
                }
                // Allow: Cmd/Ctrl + V (Paste) - let browser handle it
                if (cmdOrCtrl && (e.key === 'v' || e.key === 'V')) {
                  e.stopPropagation();
                  // Don't prevent default - let browser paste
                  return;
                }
                // Allow: Cmd/Ctrl + C (Copy) - let browser handle it
                if (cmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
                  e.stopPropagation();
                  // Don't prevent default - let browser copy
                  return;
                }
                // Allow: Cmd/Ctrl + X (Cut) - let browser handle it
                if (cmdOrCtrl && (e.key === 'x' || e.key === 'X')) {
                  e.stopPropagation();
                  // Don't prevent default - let browser cut
                  return;
                }
                // Allow: Cmd/Ctrl + Z (Undo) - let browser handle it
                if (cmdOrCtrl && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
                  e.stopPropagation();
                  // Don't prevent default - let browser undo
                  return;
                }
                // Allow: Cmd/Ctrl + Shift + Z (Redo) - let browser handle it
                if (cmdOrCtrl && (e.key === 'z' || e.key === 'Z') && e.shiftKey) {
                  e.stopPropagation();
                  // Don't prevent default - let browser redo
                  return;
                }
              }}
              className="w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50"
              spellCheck={false}
            />
          ) : (
            <pre className="w-full h-64 p-4 font-mono text-sm bg-gray-50 overflow-auto text-gray-700">
              {value}
            </pre>
          )}
        </div>

        {!isValid && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Invalid JSON format
          </p>
        )}
      </CardContent>

      {editable && (
        <>
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={!isValid || !hasChanges || saving}
              loading={saving}
              icon={Save}
              className="w-full sm:w-auto"
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={handlePublishClick}
              disabled={!isValid || !hasDraftContent || publishing}
              loading={publishing}
              icon={Rocket}
              className="w-full sm:w-auto"
            >
              Publish
            </Button>
          </div>
          
          <Dialog
            isOpen={showPublishDialog}
            onClose={() => setShowPublishDialog(false)}
            title="Publish Configuration"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to publish this configuration? This will make it live and available via the API.
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Publish Options:</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handlePublishConfirm('now')}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="font-medium text-gray-900">Publish Now</div>
                    <div className="text-xs text-gray-500 mt-1">Make this configuration live immediately</div>
                  </button>
                  <button
                    onClick={() => handlePublishConfirm('with-notification')}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="font-medium text-gray-900">Publish & Notify</div>
                    <div className="text-xs text-gray-500 mt-1">Publish and send notification to team</div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPublishDialog(false)}
                  disabled={publishing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handlePublishConfirm('now')}
                  loading={publishing}
                  className="flex-1"
                  icon={Rocket}
                >
                  Publish Now
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </Card>
  );
}

