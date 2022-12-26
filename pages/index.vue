<template>
  <div class="section">
    <b-loading v-model="ssrLoading"></b-loading>

    <b-field v-if="!ssrLoading" class="file is-primary">
      <b-upload
        v-model="file"
        class="file-label"
        multiple
        accept=".pdf"
        drag-drop
        @input="processFiles"
      >
        <span class="file-cta">
          <b-icon class="file-icon" icon="upload"></b-icon>
          <span class="file-label">Upload Invoice</span>
        </span>
        <b-loading v-model="processing"></b-loading>
      </b-upload>
    </b-field>

    <b-table
      v-if="!ssrLoading"
      ref="table"
      :data="invoices"
      paginated
      :per-page="perPage"
      :loading="loading"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <b-table-column v-slot="props" field="id" label="Unique ID" sortable>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="fileName"
        label="File Name"
        sortable
      >
        <a :href="props.row.fileUrl" target="_blank">
          {{ props.row.fileName }}
        </a>
      </b-table-column>

      <b-table-column v-slot="props" field="status" label="Status" sortable>
        <b-tag
          v-if="props.row.status === Status.DONE"
          type="is-success"
          size="is-medium"
        >
          {{ props.row.status }}
        </b-tag>
        <b-tag
          v-else-if="props.row.status === Status.ERROR"
          type="is-danger"
          size="is-medium"
        >
          {{ props.row.status }}
        </b-tag>
        <b-tag v-else type="is-info" size="is-medium">
          {{ props.row.status }}
        </b-tag>
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="invoiceValue"
        label="Invoice Value"
        sortable
      >
        {{ props.row.invoiceValue }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="invoiceDate"
        label="Invoice Date"
        sortable
      >
        {{ props.row.invoiceDate }}
      </b-table-column>

      <b-table-column v-slot="props" field="abn" label="ABN" sortable>
        {{ props.row.abn }}
      </b-table-column>

      <b-table-column v-slot="props" field="total" label="Total" sortable>
        {{ props.row.total }}
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No invoices found!</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { Status } from '@constants'

export default {
  name: 'HomePage',
  data() {
    return {
      Status,
      file: null,
      ssrLoading: true,
      loading: false,
      processing: false,
      invoices: [],
      perPage: 10
    }
  },
  mounted() {
    this.ssrLoading = false
    this.refreshData()
  },
  methods: {
    async refreshData() {
      this.loading = true

      try {
        await this.$fire.firestore
          .collection('invoices')
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (!this.invoices.some((x) => x.id === doc.id)) {
                this.invoices.push({ ...doc.data(), id: doc.id })
              } else if (
                this.invoices.some(
                  (x) => x.id === doc.id && x.status !== doc.data().status
                )
              ) {
                const index = this.invoices.findIndex((x) => x.id === doc.id)
                if (index)
                  this.invoices.splice(index, 1, { ...doc.data(), id: doc.id })
              }
            })
          })
      } catch (ex) {
        this.$buefy.toast.open({
          duration: 3000,
          message: ex,
          type: 'is-danger'
        })
      }

      this.loading = false
    },
    async processFiles(files) {
      if (files.length === 0) return []

      this.processing = true

      // 3. Loop over all the files
      for (let i = 0; i < files.length; i++) {
        // 3A. Get a file to upload
        const file = files[i]

        // 3B. handleFileUploadOnFirebaseStorage function is in above section
        const { fileName, fileUrl, filePath } =
          await this.handleFileUploadOnFirebaseStorage('raw-invoices', file)

        if (fileName && fileUrl && filePath) {
          this.$fire.firestore.collection('invoices').add({
            fileName,
            fileUrl,
            filePath,
            status: Status.PROCESSING
          })
        }
      }

      this.$buefy.toast.open({
        duration: 3000,
        message:
          'Selected file(s) is being processed and will be available shorty.',
        type: 'is-success'
      })

      this.file = null
      this.processing = false

      // once done processing the file, run a firebase function
      const processInvoices =
        this.$fire.functions.httpsCallable('processInvoices')
      processInvoices().then((result) => {
        // Read result of the Cloud Function.
      })
    },
    async handleFileUploadOnFirebaseStorage(bucketName, file) {
      // 1. If no file, return
      if (file === '') return {}

      // 2. Put the file into bucketName
      try {
        const fileName = file.name
        const filePath = `${bucketName}/${this.getUniqueFilename(fileName)}`
        const uploadTask = await this.$fire.storage.ref(filePath).put(file)

        // 3. Get download URL and return it as
        const fileUrl = await uploadTask.ref
          .getDownloadURL()
          .then((fileURL) => fileURL)
        return { fileName, fileUrl, filePath }
      } catch (ex) {
        this.$buefy.toast.open({
          duration: 3000,
          message: ex,
          type: 'is-danger'
        })
      }

      return {}
    },
    getUniqueFilename(fileName) {
      const parts = fileName.split('.')
      const ext = parts.pop()
      const timestamp = Date.now()
      const newFileName = `${parts.join('.')}-${timestamp}.${ext}`
      return newFileName
    }
  }
}
</script>
