'use client';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BulbOutlined,
  ColumnWidthOutlined,
  CopyOutlined,
  DeleteOutlined,
  GlobalOutlined,
  PlusOutlined,
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
  theme,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

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

interface ElementTemplate {
  type: ElementType;
  label: string;
  defaultRowSpan: number;
  defaultColSpan: number;
  color: string;
  borderColor: string;
}

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

const MOCK_SECTIONS: Section[] = [
  {
    id: '1',
    name: 'キャンペーンヘッダー',
    type: 'text',
    content: '初回限定キャンペーン！最大5,000円OFF。',
    comment: 'キャッチコピーは目立つように赤系でお願いします。',
    gridElements: [
      {
        id: 'e1',
        type: 'text',
        label: 'タイトル',
        comment: '大きく目立つフォントで',
        gridPosition: { row: 0, col: 0 },
        rowSpan: 2,
        colSpan: 10,
      },
      {
        id: 'e2',
        type: 'button',
        label: '申し込みボタン',
        comment: 'オレンジ色で目立たせる',
        gridPosition: { row: 3, col: 3 },
        rowSpan: 2,
        colSpan: 4,
      },
    ],
  },
  {
    id: '2',
    name: '料金表',
    type: 'pricing',
    content: '60分：12,000円\n90分：18,000円',
    comment: '税込み価格であることを明記してください。',
    gridElements: [],
  },
];

export default function PageRequestPage() {
  const [form] = Form.useForm();
  const [sections, setSections] = useState<Section[]>(MOCK_SECTIONS);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [editingSection, setEditingSection] = useState<string | null>(null);

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

  // Find empty space for a template
  const findEmptySpace = (
    sectionId: string,
    rowSpan: number,
    colSpan: number,
    excludeElementId?: string,
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return null;

    // Create collision map
    const occupied = new Array(GRID_ROWS).fill(false).map(() => new Array(GRID_COLS).fill(false));
    section.gridElements.forEach((el) => {
      // Exclude the element itself when checking (useful for moving)
      if (el.id === excludeElementId) return;

      for (let r = 0; r < el.rowSpan; r++) {
        for (let c = 0; c < el.colSpan; c++) {
          if (el.gridPosition.row + r < GRID_ROWS && el.gridPosition.col + c < GRID_COLS) {
            occupied[el.gridPosition.row + r][el.gridPosition.col + c] = true;
          }
        }
      }
    });

    // Scan for space
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

  // Helpers for collision
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
    // Only left click triggers move
    if (e.button !== 0) return;
    e.stopPropagation(); // Stop bubbling to grid background

    setIsMoving(true);
    setMovingElementId(element.id);
    setMoveStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ row: element.gridPosition.row, col: element.gridPosition.col });
  };

  const handleElementClick = (element: GridElement, e: React.MouseEvent) => {
    // If we simply clicked without dragging, open modal
    // Note: Due to mouseUp logic clearing isMoving, this fires after drag potentially.
    // We should rely on a check if move actually happened, but simplified flow:
    // If mouseUp happened and position didn't change, it's a click.
    // Handled in existing logic or UI structure?
    // Actually, `onClick` fires after `onMouseUp`. If we prevent bubbling in MouseDown, Click still fires?
    // Let's just stop propagation here too.
    e.stopPropagation();
    setCurrentElement(element);
    setElementModalOpen(true);
  };

  // Resize Handlers
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

      // Handle Resize Logic
      if (isResizing && resizingElementId && resizeStart && initialSize) {
        const element = section.gridElements.find((el) => el.id === resizingElementId);
        if (!element) return;

        const cellWidth = gridRef.current ? gridRef.current.clientWidth / GRID_COLS : 30;
        const cellHeight = 24;

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

      // Handle Move Logic
      if (isMoving && movingElementId && moveStart && initialPosition) {
        const element = section.gridElements.find((el) => el.id === movingElementId);
        if (!element) return;

        const cellWidth = gridRef.current ? gridRef.current.clientWidth / GRID_COLS : 30;
        const cellHeight = 24;

        const deltaX = e.clientX - moveStart.x;
        const deltaY = e.clientY - moveStart.y;

        const deltaCols = Math.round(deltaX / cellWidth);
        const deltaRows = Math.round(deltaY / cellHeight);

        if (deltaCols === 0 && deltaRows === 0) return; // No grid change

        let newCol = initialPosition.col + deltaCols;
        let newRow = initialPosition.row + deltaRows;

        // Boundary Check
        newCol = Math.max(0, Math.min(newCol, GRID_COLS - element.colSpan));
        newRow = Math.max(0, Math.min(newRow, GRID_ROWS - element.rowSpan));

        // Only update if position actually changed
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

  const copyToClipboard = () => {
    if (!generatedPrompt) {
      message.warning('プロンプトが生成されていません。');
      return;
    }
    navigator.clipboard.writeText(generatedPrompt);
    message.success('クリップボードにコピーしました。');
  };

  const renderGrid = (section: Section) => {
    // Render grid background (empty cells)
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

    // Render elements
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

          {/* Resize Handle */}
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
        {/* Background Grid Layer - Using Absolute positioning to overlay? No, Grid layout handles overlaps if we are careful.
            But we want background grid cells to be always visible.
            Let's put background cells in the grid, but elements need to float on top effectively.
            CSS Grid can layer items if they occupy the same space.
            So we render 200 background cells first, then the elements.
        */}
        {emptyCells}

        {/* We need to warp elements in a fragment to return array, but we are inside div */}
        {elements}
      </div>
    );
  };

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#d97706', // amber-600
            borderRadius: 8,
          },
        }}
      >
        <div className="mx-auto max-w-4xl space-y-8 pb-12">
          <div>
            <Title level={2} className="flex items-center gap-2 !text-white">
              <BulbOutlined className="text-amber-500" />
              ページ制作依頼
            </Title>
            <Paragraph className="!text-slate-400">
              新設ページの構成を作成し、AIエンジニアへの指示書（プロンプト）を発行します。
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              title: '期間限定サマーキャンペーン',
              slug: 'summer-2026',
              referenceUrls: [''],
            }}
          >
            {/* 1. ページ基本情報 */}
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
                  rules={[{ required: true, message: 'タイトルを入力してください' }]}
                >
                  <Input placeholder="例：新店舗オープン記念ページ" />
                </Form.Item>
                <Form.Item
                  label="URLスラッグ"
                  name="slug"
                  rules={[{ required: true, message: 'スラッグを入力してください' }]}
                >
                  <Input addonBefore="/service/" placeholder="new-campaign" />
                </Form.Item>
              </div>

              <Form.List name="referenceUrls">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        label={index === 0 ? '参考URL' : ''}
                        required={false}
                        key={field.key}
                        className="mb-2"
                      >
                        <Space className="flex w-full">
                          <Form.Item {...field} noStyle>
                            <Input
                              placeholder="https://example.com/ref"
                              style={{ width: '100%' }}
                            />
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
                        参考URLを追加
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>

            <Divider className="!border-slate-800 !text-slate-500">セクション構成</Divider>

            {/* 2. セクションビルダー */}
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
                          options={[
                            { value: 'text', label: 'テキスト' },
                            { value: 'slider', label: '画像スライダー' },
                            { value: 'casts', label: 'キャスト一覧' },
                            { value: 'pricing', label: '料金表' },
                            { value: 'access', label: 'アクセス' },
                            { value: 'other', label: 'その他' },
                          ]}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Text strong className="mb-2 block">
                          内容・文言
                        </Text>
                        <TextArea
                          rows={3}
                          value={section.content}
                          onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                          placeholder="セクションに表示するテキストや情報を入力してください"
                        />
                      </div>
                    </div>
                    <div>
                      <Text strong className="mb-2 block">
                        制作担当へのコメント
                      </Text>
                      <TextArea
                        rows={2}
                        value={section.comment}
                        onChange={(e) => updateSection(section.id, 'comment', e.target.value)}
                        placeholder="デザインの要望や、リンク先などの指示を記述してください"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Text strong>レイアウト構成 (グリッド: 10列×20行)</Text>
                        <Button
                          type="primary"
                          size="small"
                          ghost
                          onClick={() => openGridEditor(section.id)}
                        >
                          {section.gridElements.length > 0 ? '編集 / プレビュー' : 'レイアウト編集'}
                        </Button>
                      </div>
                      {section.gridElements.length > 0 && (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-3">
                          <div className="space-y-1 text-xs">
                            {section.gridElements.map((el) => (
                              <div key={el.id} className="text-slate-400">
                                • [{ELEMENT_TYPE_LABELS[el.type]}] {el.label}
                                {` (位置: 行${el.gridPosition.row + 1}, 列${el.gridPosition.col + 1} / サイズ: ${el.colSpan}x${el.rowSpan})`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                type="dashed"
                block
                size="large"
                icon={<PlusOutlined />}
                onClick={addSection}
                className="h-16 border-amber-500/30 text-amber-500 hover:border-amber-400 hover:text-amber-400"
              >
                新しいセクションを追加
              </Button>
            </div>

            <Divider className="!border-slate-800" />

            {/* 3. プロンプト生成エリア */}
            <div className="space-y-4">
              <Button
                type="primary"
                size="large"
                block
                icon={<BulbOutlined />}
                onClick={generatePrompt}
                className="h-14 text-lg font-bold"
              >
                AI用プロンプトを生成
              </Button>

              {generatedPrompt && (
                <Card
                  title="生成されたプロンプト"
                  extra={
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={copyToClipboard}
                    >
                      クリップボードにコピー
                    </Button>
                  }
                  className="border-amber-500/30 bg-slate-900/50"
                >
                  <TextArea
                    value={generatedPrompt}
                    readOnly
                    rows={12}
                    className="resize-none border-none bg-transparent p-0 font-mono text-sm !text-slate-300 focus:ring-0"
                  />
                </Card>
              )}
            </div>
          </Form>
        </div>

        {/* グリッドエディターモーダル */}
        <Modal
          title={`レイアウト編集: ${sections.find((s) => s.id === editingSection)?.name || ''}`}
          open={!!editingSection}
          onCancel={closeGridEditor}
          footer={null}
          width={1000}
          className="top-5"
        >
          {editingSection && (
            <div className="flex h-[70vh] gap-6">
              {/* Left: Grid Area */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>10列 × 20行 グリッドエリア</span>
                  <span>要素クリックで編集・右下ドラッグでリサイズ</span>
                </div>
                {renderGrid(sections.find((s) => s.id === editingSection)!)}
              </div>

              {/* Right: Element Palette */}
              <div className="flex w-64 min-w-[250px] flex-col gap-3 overflow-y-auto border-l border-slate-800 pl-4">
                <Title level={5} className="mb-0 flex items-center gap-2 !text-white">
                  <ColumnWidthOutlined /> 要素パレット
                </Title>
                <div className="mb-2 text-xs text-slate-400">クリックしてグリッドに配置</div>

                <div className="space-y-3">
                  {ELEMENT_TEMPLATES.map((template) => (
                    <div
                      key={template.type}
                      onClick={() => handleTemplateClick(template)}
                      className={`cursor-pointer rounded border-l-4 p-3 transition-all hover:brightness-110 active:scale-95 ${template.color} ${template.borderColor} `}
                    >
                      <div className="text-sm font-bold text-white">{template.label}</div>
                      <div className="mt-1 text-[10px] text-white/80">
                        サイズ: {template.defaultColSpan}x{template.defaultRowSpan}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* 要素編集モーダル */}
        <Modal
          title={currentElement.id ? '要素を編集' : '新しい要素を追加'}
          open={elementModalOpen}
          onOk={saveElement}
          onCancel={() => {
            setElementModalOpen(false);
            setCurrentElement({});
          }}
          okText="保存"
          cancelText="キャンセル"
          footer={[
            currentElement.id && (
              <Button key="delete" danger onClick={deleteElement}>
                削除
              </Button>
            ),
            <Button key="cancel" onClick={() => setElementModalOpen(false)}>
              キャンセル
            </Button>,
            <Button key="save" type="primary" onClick={saveElement}>
              保存
            </Button>,
          ]}
        >
          <div className="space-y-4 pt-4">
            <div>
              <Text strong className="mb-2 block">
                要素タイプ
              </Text>
              <Select
                value={currentElement.type}
                onChange={(val) => setCurrentElement({ ...currentElement, type: val })}
                className="w-full"
                placeholder="タイプを選択"
                options={[
                  { value: 'button', label: 'ボタン' },
                  { value: 'slider', label: 'スライダー' },
                  { value: 'text', label: 'テキスト' },
                  { value: 'image', label: '画像' },
                  { value: 'input', label: '入力欄' },
                ]}
              />
            </div>
            <div>
              <Text strong className="mb-2 block">
                ラベル
              </Text>
              <Input
                value={currentElement.label}
                onChange={(e) => setCurrentElement({ ...currentElement, label: e.target.value })}
                placeholder="例：申し込みボタン"
              />
            </div>
            <div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Text strong className="mb-2 block">
                    高さ (行)
                  </Text>
                  <Input
                    type="number"
                    value={currentElement.rowSpan}
                    onChange={(e) =>
                      setCurrentElement({ ...currentElement, rowSpan: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Text strong className="mb-2 block">
                    幅 (列)
                  </Text>
                  <Input
                    type="number"
                    value={currentElement.colSpan}
                    onChange={(e) =>
                      setCurrentElement({ ...currentElement, colSpan: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <Text strong className="mb-2 block">
                コメント
              </Text>
              <TextArea
                rows={3}
                value={currentElement.comment}
                onChange={(e) => setCurrentElement({ ...currentElement, comment: e.target.value })}
                placeholder="この要素に関する指示やコメントを入力"
              />
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </AntdRegistry>
  );
}
