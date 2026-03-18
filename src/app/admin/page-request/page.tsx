'use client';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BulbOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// --- Types ---

type SectionType = 'text' | 'slider' | 'casts' | 'pricing' | 'access' | 'other';
type ElementType = 'button' | 'slider' | 'text' | 'image' | 'input';

const GRID_ROWS = 20;
const GRID_COLS = 10;

interface GridElement {
  id: string;
  type: ElementType;
  label: string;
  comment: string;
  gridPosition: { row: number; col: number };
  rowSpan: number;
  colSpan: number;
}

interface Section {
  id: string;
  name: string;
  type: SectionType;
  content: string;
  comment: string;
  gridElements: GridElement[];
}

interface PageRequest {
  id: string;
  title: string;
  slug: string;
  referenceUrls: string[];
  sections: Section[];
  updatedAt: string;
  status: 'draft' | 'published';
}

interface ElementTemplate {
  type: ElementType;
  label: string;
  defaultRowSpan: number;
  defaultColSpan: number;
  color: string;
  borderColor: string;
}

// --- Constants ---

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  text: 'テキスト',
  slider: '画像スライダー',
  casts: 'キャスト一覧',
  pricing: '料金表',
  access: 'アクセス',
  other: 'その他',
};

const ELEMENT_TYPE_LABELS: Record<ElementType, string> = {
  button: 'ボタン',
  slider: 'スライダー',
  text: 'テキスト',
  image: '画像',
  input: '入力欄',
};

const ELEMENT_TEMPLATES: ElementTemplate[] = [
  {
    type: 'slider',
    label: '画像スライダー',
    defaultRowSpan: 6,
    defaultColSpan: 10,
    color: 'bg-blue-500/40',
    borderColor: 'border-blue-500',
  },
  {
    type: 'image',
    label: '画像',
    defaultRowSpan: 4,
    defaultColSpan: 5,
    color: 'bg-purple-500/40',
    borderColor: 'border-purple-500',
  },
  {
    type: 'text',
    label: 'テキストブロック',
    defaultRowSpan: 3,
    defaultColSpan: 10,
    color: 'bg-green-500/40',
    borderColor: 'border-green-500',
  },
  {
    type: 'button',
    label: 'ボタン',
    defaultRowSpan: 2,
    defaultColSpan: 3,
    color: 'bg-amber-500/40',
    borderColor: 'border-amber-500',
  },
  {
    type: 'input',
    label: '入力フォーム',
    defaultRowSpan: 2,
    defaultColSpan: 5,
    color: 'bg-rose-500/40',
    borderColor: 'border-rose-500',
  },
];

// --- Sub Component: Layout Editor ---

interface RecruitLayoutEditorProps {
  initialData?: PageRequest;
  onSave: (data: Omit<PageRequest, 'id' | 'updatedAt' | 'status'>) => void;
  onCancel: () => void;
}

const RecruitLayoutEditor = ({ initialData, onSave, onCancel }: RecruitLayoutEditorProps) => {
  const [form] = Form.useForm();
  const [sections, setSections] = useState<Section[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Initialize Data
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        slug: initialData.slug,
        referenceUrls: initialData.referenceUrls,
      });
      setSections(initialData.sections);
    } else {
      // Default for new request
      setSections([
        {
          id: Math.random().toString(36).substr(2, 9),
          name: 'メインビジュアル',
          type: 'slider',
          content: '',
          comment: '',
          gridElements: [],
        },
      ]);
    }
  }, [initialData, form]);

  // Grid Interaction State
  const [isResizing, setIsResizing] = useState(false);
  const [resizingElementId, setResizingElementId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number } | null>(null);
  const [initialSize, setInitialSize] = useState<{ rowSpan: number; colSpan: number } | null>(null);

  // Moving State
  const [isMoving, setIsMoving] = useState(false);
  const [movingElementId, setMovingElementId] = useState<string | null>(null);
  const [moveStart, setMoveStart] = useState<{ x: number; y: number } | null>(null);
  const [initialPosition, setInitialPosition] = useState<{ row: number; col: number } | null>(null);

  const [elementModalOpen, setElementModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState<Partial<GridElement>>({});

  const gridRef = useRef<HTMLDivElement>(null);

  // --- Logic Functions (Copied from previous implementation) ---

  const addSection = () => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      name: '新しいセクション',
      type: 'text',
      content: '',
      comment: '',
      gridElements: [],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[newIndex];
    newSections[newIndex] = temp;
    setSections(newSections);
  };

  const openGridEditor = (sectionId: string) => {
    setEditingSection(sectionId);
  };

  const closeGridEditor = () => {
    setEditingSection(null);
    setIsResizing(false);
    setResizingElementId(null);
    setIsMoving(false);
    setMovingElementId(null);
  };

  const findEmptySpace = (
    sectionId: string,
    rowSpan: number,
    colSpan: number,
    excludeElementId?: string,
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return null;

    const occupied = new Array(GRID_ROWS).fill(false).map(() => new Array(GRID_COLS).fill(false));
    section.gridElements.forEach((el) => {
      if (el.id === excludeElementId) return;
      for (let r = 0; r < el.rowSpan; r++) {
        for (let c = 0; c < el.colSpan; c++) {
          if (el.gridPosition.row + r < GRID_ROWS && el.gridPosition.col + c < GRID_COLS) {
            occupied[el.gridPosition.row + r][el.gridPosition.col + c] = true;
          }
        }
      }
    });

    for (let r = 0; r <= GRID_ROWS - rowSpan; r++) {
      for (let c = 0; c <= GRID_COLS - colSpan; c++) {
        let fits = true;
        for (let i = 0; i < rowSpan; i++) {
          for (let j = 0; j < colSpan; j++) {
            if (occupied[r + i][c + j]) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }
        if (fits) return { row: r, col: c };
      }
    }
    return null;
  };

  const checkCollision = (
    section: Section,
    element: GridElement,
    newRow: number,
    newCol: number,
    newRowSpan: number,
    newColSpan: number,
  ) => {
    return section.gridElements.some((other) => {
      if (other.id === element.id) return false;
      const otherEndRow = other.gridPosition.row + other.rowSpan - 1;
      const otherEndCol = other.gridPosition.col + other.colSpan - 1;
      const newEndRow = newRow + newRowSpan - 1;
      const newEndCol = newCol + newColSpan - 1;
      return !(
        newEndRow < other.gridPosition.row ||
        newRow > otherEndRow ||
        newEndCol < other.gridPosition.col ||
        newCol > otherEndCol
      );
    });
  };

  const handleTemplateClick = (template: ElementTemplate) => {
    if (!editingSection) return;
    const position = findEmptySpace(
      editingSection,
      template.defaultRowSpan,
      template.defaultColSpan,
    );
    if (!position) {
      message.error('配置するスペースが足りません');
      return;
    }
    const section = sections.find((s) => s.id === editingSection);
    if (!section) return;
    const newElement: GridElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: template.type,
      label: template.label,
      comment: '',
      gridPosition: position,
      rowSpan: template.defaultRowSpan,
      colSpan: template.defaultColSpan,
    };
    const updatedElements = [...section.gridElements, newElement];
    updateSection(editingSection, 'gridElements', updatedElements);
  };

  const handleElementMouseDown = (element: GridElement, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsMoving(true);
    setMovingElementId(element.id);
    setMoveStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ row: element.gridPosition.row, col: element.gridPosition.col });
  };

  const handleElementClick = (element: GridElement, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentElement(element);
    setElementModalOpen(true);
  };

  const handleResizeStart = (e: React.MouseEvent, element: GridElement) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizingElementId(element.id);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ rowSpan: element.rowSpan, colSpan: element.colSpan });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!editingSection) return;
      const section = sections.find((s) => s.id === editingSection);
      if (!section) return;

      const cellWidth = gridRef.current ? gridRef.current.clientWidth / GRID_COLS : 30;
      const cellHeight = 24;

      if (isResizing && resizingElementId && resizeStart && initialSize) {
        const element = section.gridElements.find((el) => el.id === resizingElementId);
        if (!element) return;

        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const deltaCols = Math.round(deltaX / cellWidth);
        const deltaRows = Math.round(deltaY / cellHeight);

        let newColSpan = Math.max(1, initialSize.colSpan + deltaCols);
        let newRowSpan = Math.max(1, initialSize.rowSpan + deltaRows);

        if (element.gridPosition.col + newColSpan > GRID_COLS)
          newColSpan = GRID_COLS - element.gridPosition.col;
        if (element.gridPosition.row + newRowSpan > GRID_ROWS)
          newRowSpan = GRID_ROWS - element.gridPosition.row;

        if (
          !checkCollision(
            section,
            element,
            element.gridPosition.row,
            element.gridPosition.col,
            newRowSpan,
            newColSpan,
          )
        ) {
          const updatedElements = section.gridElements.map((el) =>
            el.id === element.id ? { ...el, rowSpan: newRowSpan, colSpan: newColSpan } : el,
          );
          setSections((prev) =>
            prev.map((s) =>
              s.id === editingSection ? { ...s, gridElements: updatedElements } : s,
            ),
          );
        }
        return;
      }

      if (isMoving && movingElementId && moveStart && initialPosition) {
        const element = section.gridElements.find((el) => el.id === movingElementId);
        if (!element) return;

        const deltaX = e.clientX - moveStart.x;
        const deltaY = e.clientY - moveStart.y;
        const deltaCols = Math.round(deltaX / cellWidth);
        const deltaRows = Math.round(deltaY / cellHeight);

        if (deltaCols === 0 && deltaRows === 0) return;

        let newCol = initialPosition.col + deltaCols;
        let newRow = initialPosition.row + deltaRows;

        newCol = Math.max(0, Math.min(newCol, GRID_COLS - element.colSpan));
        newRow = Math.max(0, Math.min(newRow, GRID_ROWS - element.rowSpan));

        if (newCol !== element.gridPosition.col || newRow !== element.gridPosition.row) {
          if (!checkCollision(section, element, newRow, newCol, element.rowSpan, element.colSpan)) {
            const updatedElements = section.gridElements.map((el) =>
              el.id === element.id ? { ...el, gridPosition: { row: newRow, col: newCol } } : el,
            );
            setSections((prev) =>
              prev.map((s) =>
                s.id === editingSection ? { ...s, gridElements: updatedElements } : s,
              ),
            );
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingElementId(null);
      setResizeStart(null);
      setInitialSize(null);
      setIsMoving(false);
      setMovingElementId(null);
      setMoveStart(null);
      setInitialPosition(null);
    };

    if (isResizing || isMoving) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isResizing,
    resizingElementId,
    resizeStart,
    initialSize,
    isMoving,
    movingElementId,
    moveStart,
    initialPosition,
    editingSection,
    sections,
  ]);

  const saveElement = () => {
    if (!editingSection || !currentElement.type || !currentElement.label) {
      message.warning('要素タイプとラベルを入力してください');
      return;
    }
    const section = sections.find((s) => s.id === editingSection);
    if (!section) return;
    const newElement: GridElement = {
      id: currentElement.id || Math.random().toString(36).substr(2, 9),
      type: currentElement.type,
      label: currentElement.label,
      comment: currentElement.comment || '',
      gridPosition: currentElement.gridPosition!,
      rowSpan: currentElement.rowSpan || 1,
      colSpan: currentElement.colSpan || 1,
    };
    const updatedElements = currentElement.id
      ? section.gridElements.map((e) => (e.id === currentElement.id ? newElement : e))
      : [...section.gridElements, newElement];
    updateSection(editingSection, 'gridElements', updatedElements);
    setElementModalOpen(false);
    setCurrentElement({});
    message.success('要素を保存しました');
  };

  const deleteElement = () => {
    if (!editingSection || !currentElement.id) return;
    const section = sections.find((s) => s.id === editingSection);
    if (!section) return;
    const updatedElements = section.gridElements.filter((e) => e.id !== currentElement.id);
    updateSection(editingSection, 'gridElements', updatedElements);
    setElementModalOpen(false);
    setCurrentElement({});
    message.success('要素を削除しました');
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({
          title: values.title,
          slug: values.slug,
          referenceUrls: values.referenceUrls || [],
          sections: sections,
        });
      })
      .catch(() => {
        message.error('入力内容を確認してください');
      });
  };

  const generatePrompt = () => {
    const values = form.getFieldsValue();
    let prompt = `以下の要件に基づいて、新しい特設ページの制作をお願いします。\n\n`;
    prompt += `【ページ基本情報】\n`;
    prompt += `- サイトタイトル: ${values.title || '（未入力）'}\n`;
    prompt += `- URLスラッグ: /service/${values.slug || '（未入力）'}\n`;

    if (values.referenceUrls && values.referenceUrls.length > 0) {
      prompt += `- 参考URL:\n`;
      values.referenceUrls.forEach((url: string) => {
        if (url) prompt += `  - ${url}\n`;
      });
    }

    prompt += `\n【構成セクション】\n`;
    sections.forEach((s, idx) => {
      prompt += `### セクション ${idx + 1}: ${s.name} (${SECTION_TYPE_LABELS[s.type]})\n`;
      prompt += `- 内容・文言: ${s.content || '（未入力）'}\n`;
      if (s.comment) {
        prompt += `- 制作担当への要望: ${s.comment}\n`;
      }
      if (s.gridElements.length > 0) {
        prompt += `- レイアウト構成 (10x20グリッド):\n`;
        s.gridElements.forEach((el) => {
          prompt += `  - [${ELEMENT_TYPE_LABELS[el.type]}] ${el.label}\n`;
          prompt += `    位置: 行${el.gridPosition.row + 1}, 列${el.gridPosition.col + 1}\n`;
          prompt += `    サイズ: 幅${el.colSpan}, 高さ${el.rowSpan}\n`;
          if (el.comment) {
            prompt += `    コメント: ${el.comment}\n`;
          }
        });
      }
      prompt += `\n`;
    });
    prompt += `以上の構成で、モダンで高級感のあるデザインをベースにプログラミングを完了させてください。`;
    setGeneratedPrompt(prompt);
    message.success('プロンプトを生成しました。');
  };

  // --- Render Functions ---

  const renderGrid = (section: Section) => {
    const emptyCells = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        emptyCells.push(
          <div
            key={`bg-${r}-${c}`}
            className="border border-slate-800 bg-slate-900/40"
            style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
          />,
        );
      }
    }

    const elements = section.gridElements.map((el) => {
      const template = ELEMENT_TEMPLATES.find((t) => t.type === el.type);
      const isBeingResized = resizingElementId === el.id;
      const isBeingMoved = movingElementId === el.id;

      return (
        <div
          key={el.id}
          className={`group relative flex select-none flex-col items-center justify-center overflow-hidden rounded border-2 transition-colors ${template?.color || 'bg-slate-700'} ${template?.borderColor || 'border-slate-500'} ${isBeingResized ? 'z-50 cursor-se-resize opacity-80 ring-2 ring-white' : ''} ${isBeingMoved ? 'z-50 cursor-grabbing opacity-50' : 'z-10 cursor-grab hover:brightness-110'} `}
          style={{
            gridColumnStart: el.gridPosition.col + 1,
            gridColumnEnd: `span ${el.colSpan}`,
            gridRowStart: el.gridPosition.row + 1,
            gridRowEnd: `span ${el.rowSpan}`,
            zIndex: isBeingMoved ? 100 : isBeingResized ? 50 : 10,
          }}
          onMouseDown={(e) => handleElementMouseDown(el, e)}
          onClick={(e) => handleElementClick(el, e)}
        >
          <div className="pointer-events-none w-full truncate px-1 text-center text-[10px] font-bold text-white drop-shadow-md md:text-xs">
            {el.label}
          </div>
          {el.rowSpan >= 2 && (
            <div className="pointer-events-none scale-90 text-[9px] text-white/80">
              {ELEMENT_TYPE_LABELS[el.type]}
            </div>
          )}

          <div
            className="absolute bottom-0 right-0 flex h-4 w-4 cursor-se-resize items-end justify-end p-[1px] opacity-0 transition-opacity group-hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, el)}
          >
            <div className="h-1.5 w-1.5 rounded-sm bg-white shadow-sm"></div>
          </div>
        </div>
      );
    });

    return (
      <div
        ref={gridRef}
        className="grid w-full gap-[2px] rounded-lg border border-slate-800 bg-slate-950 p-2 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 24px)`,
          aspectRatio: '10/20',
        }}
      >
        {emptyCells}
        {elements}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Editor Actions */}
      <div className="mb-4 flex items-center justify-between">
        <Button icon={<RollbackOutlined />} onClick={onCancel}>
          一覧に戻る
        </Button>
        <Space>
          <Button icon={<BulbOutlined />} onClick={generatePrompt}>
            プロンプト生成
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
        </Space>
      </div>

      {/* Prompt Preview */}
      {generatedPrompt && (
        <Card className="mb-4 !border-slate-700 !bg-slate-800">
          <Text className="mb-2 block !text-slate-300">生成されたプロンプト:</Text>
          <TextArea
            value={generatedPrompt}
            autoSize={{ minRows: 3, maxRows: 10 }}
            className="!bg-slate-900 !text-slate-200"
            readOnly
          />
          <Button
            icon={<CopyOutlined />}
            className="mt-2"
            onClick={() => {
              navigator.clipboard.writeText(generatedPrompt);
              message.success('コピーしました');
            }}
          >
            コピー
          </Button>
        </Card>
      )}

      <Form form={form} layout="vertical" initialValues={{ referenceUrls: [''] }}>
        <Card
          title={
            <Space>
              <GlobalOutlined />
              ページ基本情報
            </Space>
          }
          className="shadow-md"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="ページタイトル"
              name="title"
              rules={[{ required: true, message: '必須です' }]}
            >
              <Input placeholder="例：新店舗オープン記念ページ" />
            </Form.Item>
            <Form.Item
              label="URLスラッグ"
              name="slug"
              rules={[{ required: true, message: '必須です' }]}
            >
              <Input addonBefore="/service/" placeholder="new-campaign" />
            </Form.Item>
          </div>
          <Form.List name="referenceUrls">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item label={index === 0 ? '参考URL' : ''} key={field.key} className="mb-2">
                    <Space className="flex w-full">
                      <Form.Item {...field} noStyle>
                        <Input placeholder="https://example.com" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Space>
                  </Form.Item>
                ))}
                <Form.Item className="mt-2">
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    追加
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Divider className="!border-slate-800 !text-slate-500">セクション構成</Divider>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              size="small"
              title={
                <Input
                  value={section.name}
                  onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                  className="font-bold"
                  placeholder="セクション名"
                  bordered={false}
                />
              }
              extra={
                <Space>
                  <Button
                    size="small"
                    icon={<ArrowUpOutlined />}
                    disabled={index === 0}
                    onClick={() => moveSection(index, 'up')}
                  />
                  <Button
                    size="small"
                    icon={<ArrowDownOutlined />}
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 'down')}
                  />
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeSection(section.id)}
                  />
                </Space>
              }
              className="border-amber-500/20"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="md:col-span-1">
                    <Text strong className="mb-2 block">
                      タイプ
                    </Text>
                    <Select
                      value={section.type}
                      onChange={(val) => updateSection(section.id, 'type', val)}
                      className="w-full"
                    >
                      {(Object.keys(SECTION_TYPE_LABELS) as SectionType[]).map((type) => (
                        <Select.Option key={type} value={type}>
                          {SECTION_TYPE_LABELS[type]}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="md:col-span-3">
                    <Text strong className="mb-2 block">
                      内容・文言
                    </Text>
                    <TextArea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <Text strong className="mb-2 block">
                    制作担当への要望
                  </Text>
                  <TextArea
                    value={section.comment}
                    onChange={(e) => updateSection(section.id, 'comment', e.target.value)}
                    rows={2}
                    placeholder="デザインの要望など"
                  />
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Text strong>レイアウト構成 (10x20 Grid)</Text>
                    {editingSection === section.id ? (
                      <Button size="small" onClick={closeGridEditor}>
                        編集を終了
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        type="primary"
                        ghost
                        onClick={() => openGridEditor(section.id)}
                      >
                        レイアウトを編集
                      </Button>
                    )}
                  </div>

                  {editingSection === section.id ? (
                    <div className="flex items-start gap-4">
                      {/* Left: Editor */}
                      <div className="w-[70%] flex-1">{renderGrid(section)}</div>
                      {/* Right: Palette */}
                      <div className="sticky top-4 w-[30%] space-y-2">
                        <Text strong className="mb-2 block !text-slate-300">
                          要素パレット
                        </Text>
                        <div className="grid grid-cols-1 gap-2">
                          {ELEMENT_TEMPLATES.map((template) => (
                            <div
                              key={template.type}
                              className={`flex cursor-pointer items-center gap-3 rounded border border-slate-700 p-3 transition-all hover:brightness-110 ${template.color} `}
                              onClick={() => handleTemplateClick(template)}
                            >
                              <div
                                className={`h-8 w-8 rounded border-2 ${template.borderColor} flex items-center justify-center bg-white/20`}
                              >
                                <PlusOutlined className="text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">{template.label}</div>
                                <div className="text-xs text-slate-300">
                                  {template.defaultColSpan}x{template.defaultRowSpan}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 rounded bg-slate-800 p-4 text-xs text-slate-400">
                          <p>パレットをクリックして配置</p>
                          <p>要素をドラッグして移動</p>
                          <p>右下ハンドルでサイズ変更</p>
                          <p>クリックして詳細編集</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded border border-slate-800 bg-slate-900 p-4 text-center text-slate-500">
                      {section.gridElements.length > 0
                        ? `${section.gridElements.length}個の要素が配置されています`
                        : '要素はまだありません'}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Button type="dashed" onClick={addSection} block icon={<PlusOutlined />} className="py-4">
          新しいセクションを追加
        </Button>
      </Form>

      {/* Element Edit Modal */}
      <Modal
        title="要素の編集"
        open={elementModalOpen}
        onOk={saveElement}
        onCancel={() => {
          setElementModalOpen(false);
          setCurrentElement({});
        }}
        footer={[
          <Button key="delete" danger icon={<DeleteOutlined />} onClick={deleteElement}>
            削除
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              setElementModalOpen(false);
              setCurrentElement({});
            }}
          >
            キャンセル
          </Button>,
          <Button key="submit" type="primary" onClick={saveElement}>
            決定
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="ラベル">
            <Input
              value={currentElement.label}
              onChange={(e) => setCurrentElement({ ...currentElement, label: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="タイプ">
            <Select
              value={currentElement.type}
              onChange={(val) => setCurrentElement({ ...currentElement, type: val })}
            >
              {(Object.keys(ELEMENT_TYPE_LABELS) as ElementType[]).map((t) => (
                <Select.Option key={t} value={t}>
                  {ELEMENT_TYPE_LABELS[t]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="幅 (Col Span)">
              <Input
                type="number"
                min={1}
                max={GRID_COLS}
                value={currentElement.colSpan}
                onChange={(e) =>
                  setCurrentElement({ ...currentElement, colSpan: Number(e.target.value) })
                }
              />
            </Form.Item>
            <Form.Item label="高さ (Row Span)">
              <Input
                type="number"
                min={1}
                max={GRID_ROWS}
                value={currentElement.rowSpan}
                onChange={(e) =>
                  setCurrentElement({ ...currentElement, rowSpan: Number(e.target.value) })
                }
              />
            </Form.Item>
          </div>
          <Form.Item label="コメント">
            <TextArea
              value={currentElement.comment}
              onChange={(e) => setCurrentElement({ ...currentElement, comment: e.target.value })}
              rows={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// --- Main Component: Manager ---

export default function PageRequestManager() {
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'create'>('list');
  const [requests, setRequests] = useState<PageRequest[]>([]);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingRequestId(null);
    setViewMode('create');
  };

  const handleEdit = (id: string) => {
    setEditingRequestId(id);
    setViewMode('edit');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '削除しますか？',
      content: 'この操作は取り消せません。',
      onOk: () => {
        setRequests(requests.filter((r) => r.id !== id));
        message.success('削除しました');
      },
    });
  };

  const handleSave = (data: Omit<PageRequest, 'id' | 'updatedAt' | 'status'>) => {
    if (viewMode === 'create') {
      const newRequest: PageRequest = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      };
      setRequests([newRequest, ...requests]);
      message.success('新規作成しました');
    } else if (viewMode === 'edit' && editingRequestId) {
      setRequests(
        requests.map((r) =>
          r.id === editingRequestId ? { ...r, ...data, updatedAt: new Date().toISOString() } : r,
        ),
      );
      message.success('更新しました');
    }
    setViewMode('list');
    setEditingRequestId(null);
  };

  const columns = [
    {
      title: 'タイトル',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'スラッグ',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag color="blue">/service/{slug}</Tag>,
    },
    {
      title: '更新日時',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'アクション',
      key: 'action',
      render: (_: any, record: PageRequest) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            編集
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            削除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#d97706',
            borderRadius: 8,
          },
        }}
      >
        <div className="mx-auto max-w-6xl p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Title level={2} className="!mb-0 flex items-center gap-2 !text-white">
                <BulbOutlined className="text-amber-500" />
                ページ制作依頼管理
              </Title>
              <Paragraph className="!mb-0 mt-2 !text-slate-400">
                AIエンジニアへの制作指示書を作成・管理します。
              </Paragraph>
            </div>
            {viewMode === 'list' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
                新規依頼を作成
              </Button>
            )}
          </div>

          {viewMode === 'list' ? (
            <Card className="shadow-md">
              <Table
                dataSource={requests}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          ) : (
            <RecruitLayoutEditor
              initialData={
                viewMode === 'edit' ? requests.find((r) => r.id === editingRequestId) : undefined
              }
              onSave={handleSave}
              onCancel={() => {
                setViewMode('list');
                setEditingRequestId(null);
              }}
            />
          )}
        </div>
      </ConfigProvider>
    </AntdRegistry>
  );
}
