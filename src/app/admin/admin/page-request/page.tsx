'use client';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BulbOutlined,
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
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type SectionType = 'text' | 'slider' | 'casts' | 'pricing' | 'access' | 'other';
type ElementType = 'button' | 'slider' | 'text' | 'image' | 'input';

interface GridElement {
  id: string;
  type: ElementType;
  label: string;
  comment: string;
  gridPosition: { row: number; col: number };
}

interface Section {
  id: string;
  name: string;
  type: SectionType;
  content: string;
  comment: string;
  gridElements: GridElement[];
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
      },
      {
        id: 'e2',
        type: 'button',
        label: '申し込みボタン',
        comment: 'オレンジ色で目立たせる',
        gridPosition: { row: 1, col: 1 },
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
  const [elementModalOpen, setElementModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState<Partial<GridElement>>({});

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
  };

  const handleCellClick = (row: number, col: number, sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const existingElement = section.gridElements.find(
      (e) => e.gridPosition.row === row && e.gridPosition.col === col,
    );

    if (existingElement) {
      setCurrentElement(existingElement);
      setElementModalOpen(true);
    } else {
      setCurrentElement({ gridPosition: { row, col } });
      setElementModalOpen(true);
    }
  };

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
        prompt += `- レイアウト構成:\n`;
        s.gridElements.forEach((el) => {
          prompt += `  - [${ELEMENT_TYPE_LABELS[el.type]}] ${el.label} (位置: 行${el.gridPosition.row + 1}, 列${el.gridPosition.col + 1})\n`;
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
    const rows = 4;
    const cols = 3;
    const grid = [];

    for (let row = 0; row < rows; row++) {
      const rowCells = [];
      for (let col = 0; col < cols; col++) {
        const element = section.gridElements.find(
          (e) => e.gridPosition.row === row && e.gridPosition.col === col,
        );

        rowCells.push(
          <div
            key={`${row}-${col}`}
            onClick={() => handleCellClick(row, col, section.id)}
            className={`relative flex h-24 cursor-pointer items-center justify-center border-2 border-dashed transition-all hover:border-amber-500 hover:bg-amber-500/10 ${
              element ? 'border-amber-500 bg-amber-500/20' : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            {element ? (
              <div className="text-center">
                <div className="mb-1 text-xs font-bold text-amber-400">
                  {ELEMENT_TYPE_LABELS[element.type]}
                </div>
                <div className="text-xs text-white">{element.label}</div>
              </div>
            ) : (
              <PlusOutlined className="text-slate-600" />
            )}
          </div>,
        );
      }
      grid.push(
        <div key={row} className="grid grid-cols-3 gap-2">
          {rowCells}
        </div>,
      );
    }

    return <div className="space-y-2">{grid}</div>;
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
                        <Text strong>レイアウト構成 (グリッド)</Text>
                        <Button
                          type="primary"
                          size="small"
                          ghost
                          onClick={() => openGridEditor(section.id)}
                        >
                          {section.gridElements.length > 0 ? '編集' : '要素を配置'}
                        </Button>
                      </div>
                      {section.gridElements.length > 0 && (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-3">
                          <div className="space-y-1 text-xs">
                            {section.gridElements.map((el) => (
                              <div key={el.id} className="text-slate-400">
                                • [{ELEMENT_TYPE_LABELS[el.type]}] {el.label} - 行
                                {el.gridPosition.row + 1}, 列{el.gridPosition.col + 1}
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
          width={700}
        >
          {editingSection && (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-900 p-4">
                {renderGrid(sections.find((s) => s.id === editingSection)!)}
              </div>
              <div className="text-xs text-slate-400">
                グリッドのセルをクリックして要素を配置してください
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
