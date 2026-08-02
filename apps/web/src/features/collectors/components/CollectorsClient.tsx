"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Input, message, Space, Table, Typography} from "antd";
import type {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {getCollectorPage} from "@/src/features/collectors/api";
import {CollectorDTO} from "@kubuci-hort/types";

export default function CollectorsClient() {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<CollectorDTO[]>([]);
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getCollectorPage(page, size, submittedQuery || undefined);
            setRows(result.items);
            setTotal(result.totalElements);
        } catch (error) {
            console.error(error);
            message.error("Fehler beim Laden der Abholer");
        } finally { setLoading(false); }
    }, [page, size, submittedQuery]);

    useEffect(() => { void load(); }, [load]);

    const columns: ColumnsType<CollectorDTO> = useMemo(() => [
        {title: "Name", key: "name", render: (_, row) => `${row.firstName} ${row.lastName}`},
        {title: "Adresse", dataIndex: "address", key: "address"},
        {title: "Telefon", dataIndex: "phone", key: "phone"},
    ], []);

    const changePage = (pagination: TablePaginationConfig) => {
        setPage((pagination.current ?? 1) - 1);
        setSize(pagination.pageSize ?? 20);
    };

    return <Space orientation="vertical" size="large" style={{width: "100%"}}>
        <Typography.Title level={3} style={{margin: 0}}>Abholer</Typography.Title>
        <Space wrap>
            <Input allowClear placeholder="Name" value={query} onChange={event => setQuery(event.target.value)}
                   onPressEnter={() => { setPage(0); setSubmittedQuery(query.trim()); }} prefix={<SearchOutlined/>}/>
            <Button type="primary" icon={<SearchOutlined/>} onClick={() => { setPage(0); setSubmittedQuery(query.trim()); }}>Suchen</Button>
            <Button icon={<ReloadOutlined/>} onClick={() => { setQuery(""); setSubmittedQuery(""); setPage(0); }}/>
        </Space>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={rows} onChange={changePage}
               pagination={{current: page + 1, pageSize: size, total, showSizeChanger: true}}/>
    </Space>;
}
