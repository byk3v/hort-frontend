"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Input, message, Space, Table, Typography} from "antd";
import type {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {LoginOutlined} from "@ant-design/icons";
import type {AttendanceStudent} from "@kubuci-hort/types";
import {getCheckInCandidates, registerCheckIn} from "@/src/features/checkout/api";
import {HttpError} from "@kubuci-hort/http";

export default function CheckInClient() {
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [rows, setRows] = useState<AttendanceStudent[]>([]);
    const [loading, setLoading] = useState(false);
    const [submittingId, setSubmittingId] = useState<string>();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getCheckInCandidates(submittedQuery, page, size);
            setRows(result.items); setTotal(result.totalElements);
        } catch (error) { console.error(error); message.error("Schüler konnten nicht geladen werden"); }
        finally { setLoading(false); }
    }, [submittedQuery, page, size]);
    useEffect(() => { void load(); }, [load]);

    const checkIn = async (student: AttendanceStudent) => {
        try {
            setSubmittingId(student.id); await registerCheckIn(student.id);
            setRows(current => current.filter(item => item.id !== student.id));
            setTotal(current => Math.max(0, current - 1));
            message.success(`${student.firstName} ${student.lastName} wurde angemeldet`);
        } catch (error) {
            console.error(error);
            message.error(error instanceof HttpError && error.code === "attendance_already_checked_in"
                ? "Der Schüler wurde heute bereits angemeldet" : "Anmeldung konnte nicht gespeichert werden");
        }
        finally { setSubmittingId(undefined); }
    };

    const columns: ColumnsType<AttendanceStudent> = useMemo(() => [
        {title: "Name", render: (_, row) => `${row.firstName} ${row.lastName}`},
        {title: "Gruppe", dataIndex: "groupName"},
        {title: "", render: (_, row) => <Button type="primary" icon={<LoginOutlined/>}
            loading={submittingId === row.id} onClick={() => void checkIn(row)}>Anmelden</Button>},
    ], [submittingId]);

    const onPage = (pagination: TablePaginationConfig) => {
        setPage((pagination.current ?? 1) - 1); setSize(pagination.pageSize ?? 20);
    };
    const search = () => { setPage(0); setSubmittedQuery(query.trim()); };

    return <Space orientation="vertical" size="large" style={{width: "100%"}}>
        <Typography.Title level={3} style={{margin: 0}}>Anmeldung</Typography.Title>
        <Typography.Text type="secondary">Schüler können einmal pro Hort-Tag angemeldet werden.</Typography.Text>
        <Space><Input.Search allowClear placeholder="Name oder Gruppe" value={query}
                             onChange={event => setQuery(event.target.value)} onSearch={search}/>
            <Button onClick={() => void load()}>Aktualisieren</Button></Space>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={rows} onChange={onPage}
               pagination={{current: page + 1, pageSize: size, total, showSizeChanger: true}}/>
    </Space>;
}
